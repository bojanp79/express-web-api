//Init polyfills
const polyfills = require("aurelia-polyfills");

import {IServerConfig} from "../interfaces/server-config";
import {AuExpressServer} from "./au-express-server";
import * as path from "path";

export function bootstrap(configure ?:(server: AuExpressServer)=>void){

    //Init DI
    const auServer = new AuExpressServer();
    
    //Init defaults
    initDefaults(auServer);

    //Call to configure
    if(configure){
        configure(auServer);
    }
    
    let congigFn :any  = auServer["configure"];
    let runFn:any  = auServer["run"];

    //Configure
    congigFn.bind(auServer).apply();

    //Start
    runFn.bind(auServer).apply();
}

function initDefaults(server:AuExpressServer){    
    server.config.controllersFolder = `${path.dirname(process.argv[1])}/controllers`;
}