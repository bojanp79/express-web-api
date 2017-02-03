import { Container, NewInstance } from "aurelia-dependency-injection";
import { IServerConfig } from "../interfaces/server-config";
import { AuConsoleLogAppender } from "./au-console-log-appender";
import { ApiMetadata } from "../entities/api-metadata";
import { ApiControlerInfo } from "../entities/api-controller-info";
import { ApiMethodInfo } from "../entities/api-method-info";
import { HttpMethodType } from "../entities/http-method-type";
import { Request, Response } from 'express';
import { AuLogLevel, AuLogManager } from "./au-log-manager";
import { Logger } from "aurelia-logging";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
const glob = require('glob');

export class AuExpressServer {
    
    private _app: express.Application;
    private _config: IServerConfig;
    private _logger: Logger
    private _metadata: ApiMetadata;

    public get app(): express.Application {
        return this._app;
    }

    public get config(): IServerConfig {
        return this._config;
    }

    public get container(): Container {
        return Container.instance;
    }

    constructor() {
        const self = this;
        //Init di
        new Container().makeGlobal();

        //Add default console logger
        AuLogManager.addAppender(new AuConsoleLogAppender());
        AuLogManager.setLevel(AuLogLevel.debug);
        this._logger = AuLogManager.getLogger("AuExpressServer");


        //Set basic configuration
        this._config = {
            useCors: true,
            exposeMetadata: true,
            port: 8099,
            publicFolder: "public",
            controllersFolder: `${__dirname}/controllers`
        };
        
        this._metadata = new ApiMetadata();

        this._app = express();
    }

    private configure() {

        //Enable Cors
        if (this.config.useCors) {

            this._logger.debug("Enabeling CORS");

            this._app.use(function (req: express.Request, res: express.Response, next) {
                if(req.headers["origin"]) {
                    res.header('Access-Control-Allow-Origin', req.headers["origin"]);
                }
                if(req.headers["access-control-request-method"]) {
                    res.header('Access-Control-Allow-Methods', req.headers["access-control-request-method"]);
                }
                if(req.headers["access-control-request-headers"]){
                    res.header('Access-Control-Allow-Headers', req.headers["access-control-request-headers"]);
                }
                
                res.header('Access-Control-Allow-Credentials','true');
                if ('OPTIONS' == req.method) {
                    res.sendStatus(200);
                }
                else {
                    next();
                }
            });
        }

        //mount json form parser
        this._app.use(bodyParser.json());

        //mount query string parser
        this._app.use(bodyParser.urlencoded({ extended: true }));

        //add static paths
        this._app.use(express.static(path.join(__dirname, this.config.publicFolder)));

        //Set up the routes
        this.initRoutes();
    }


    private initRoutes() {
        const self = this;
        //Expose metadata /api/metadata
        if (this.config.exposeMetadata) {
            let router: express.Router = express.Router();
            router.get('/metadata', (request: express.Request, response: express.Response) => {
                response.json(self._metadata.getMetadataDescription());
            });
            this._app.use("/api", router);
        }

        //Init Api controllers
        this.getControllersList(this.config.controllersFolder)
            .forEach((controllerFile) => {
                self.bindController(controllerFile);
            });

        this._logger.debug(`Loaded ${this._metadata.controllers.length} API Controllers`);
    }

    private bindController(controllerFile: string) {
        const self = this;
        var imp = require(controllerFile);
        for (var key in imp) {

            //Collect default controllers
            this.tryEnrichConventionController(key, imp);

            if (imp.hasOwnProperty(key) && imp[key]._ApiController) {
                //Register controlers as transient                
                Container.instance.registerTransient(imp[key]._ApiController.fn);

                let apiControllerInfo: ApiControlerInfo = imp[key]._ApiController;

                apiControllerInfo.methods = imp[key]._ApiMethods;
                //Save to metadata
                self._metadata.controllers.push(apiControllerInfo);

                let router: express.Router = express.Router();

                apiControllerInfo.methods.forEach((apiMethod: ApiMethodInfo) => {
                    let apiMethodKey = apiMethod.methodType.toString();
                    if (router[apiMethodKey]) {
                        router[apiMethodKey](apiMethod.route, (req: Request, res: Response) => {
                            //TODO add Authorization
                            self.invokeControllerMethod(apiMethod, apiControllerInfo, req, res);
                        });
                    }
                });

                this.app.use(apiControllerInfo.route, router);
            }
        }
    }

    private tryEnrichConventionController(key: string, imp: any) {
        if (key.endsWith("Controller") && imp.hasOwnProperty(key) && !imp[key]._ApiController) {
            let ctrlInfo = new ApiControlerInfo();
            ctrlInfo.name = key;
            ctrlInfo.fn = imp[key];
            ctrlInfo.route = `/${key.replace("Controller","")}`;
            let apiMethods: ApiMethodInfo[] = [];

            for (var httpMethod of ["get","post","put","delete","patch","options","head"]) {
                if (typeof ctrlInfo.fn.prototype[httpMethod] == "function") {
                    let methodInfo = new ApiMethodInfo();
                    methodInfo.methodType = <any> httpMethod;//HttpMethodType.GET;
                    methodInfo.route = "";
                    methodInfo.controllerMethod = httpMethod.toLowerCase();
                    apiMethods.push(methodInfo);
                }

            }
            
            if (apiMethods.length > 0) {
                ctrlInfo.fn._ApiController = ctrlInfo;
                ctrlInfo.fn._ApiMethods = apiMethods;
            }
        }


    }

    private invokeControllerMethod(apiMethod: ApiMethodInfo, apiControllerInfo: ApiControlerInfo, req: Request, res: Response) {
        let instance = this.container.get(apiControllerInfo.fn);
        let body = req.body;
        let params = req.params;
        let queryParams = req.query;

        let controllerMethod = instance[apiMethod.controllerMethod];
        // no params : controllerMethod.length;
        try {
            let result = controllerMethod.bind(instance)(req, res);
            if (result) {
                res.json(result);
            }
        } catch (ex) {
            res.status(400);
        }

    }

    private getControllersList(rootFolder: string): any[] {
        let controllersList = [];
        try {
            glob.sync(`${rootFolder}/**/*.js`).forEach(function (file) {
                controllersList.push(file);
            });
        } catch (err) {
            this._logger.error(`Failed to initialize routes. ${err}`);
        }
        this._logger.debug(`Loading API Controllers ${rootFolder}`);
        return controllersList;
    }

    private run() {
        this._app.listen(this.config.port);
        this._logger.debug(`Server started (port : ${this.config.port})`);
        if (this.config.exposeMetadata) {
            this._logger.debug("API Metadata: /api/metadata");
        }

    }

}