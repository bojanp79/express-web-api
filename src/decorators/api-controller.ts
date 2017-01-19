import {ApiControlerInfo} from "../entities/api-controller-info";

/**
 * Decorator used for api controllers
 */
export function ApiController(route?: string, description?: string) {
    return function (target: any) {
        let ctrlInfo = new ApiControlerInfo();
        if(route){
            ctrlInfo.route = route;
        }else{
           ctrlInfo.route = `/${target.name.replace("Controller","")}`;
        }
        
        ctrlInfo.description = description;
        ctrlInfo.name = target.name;
        ctrlInfo.fn = target;
        //target.prototype._ApiController = ctrlInfo;
        target._ApiController = ctrlInfo;
    }
}