
import {HttpMethodType} from "../entities/http-method-type";
import {ApiMethodInfo} from "../entities/api-method-info";
import * as express from "express";

export function ApiMethod(methodType: HttpMethodType, route: string, description?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target.constructor._ApiMethods) {
            target.constructor._ApiMethods = [];
        }

        let methodInfo = new ApiMethodInfo();
        methodInfo.methodType = methodType;
        methodInfo.route = route;
        methodInfo.controllerMethod = propertyKey;
        methodInfo.description = description;

        target.constructor._ApiMethods.push(methodInfo);
        // let originalFunc = descriptor.value;

        // descriptor.value = function (req: express.Request, res: express.Response, next) {
        //     try {

        //         let result = originalFunc.apply(this, arguments);
        //         //WebApiServer.logger.debug(`Call: ${req.method} ${req.originalUrl} ${propertyKey}`);
                
        //         return result;
        //     } catch (err) {
        //         res.status(500).send(err);
        //     }

        // };
    };
}
