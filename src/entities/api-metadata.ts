import {ApiControlerInfo} from "./api-controller-info";

export class ApiMetadata {
    public controllers: ApiControlerInfo[];

    constructor() {
        this.controllers = [];
    }

    public getMetadataDescription(){
        let medatata = {
            name :"AuExpressServer",
            version:"1.0.0",
            urls:[]
        };

        this.controllers.forEach((c)=>{
            c.methods.forEach((m)=>{
                medatata.urls.push(
                    {
                        url:`${c.route}${m.route}`,
                        methodType: m.methodType.toString().toUpperCase(),
                        description : m.description
                    }
                );
            });
        });

        return medatata;
    }
}