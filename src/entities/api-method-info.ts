import {HttpMethodType} from "./http-method-type";

export class ApiMethodInfo {
    public methodType: HttpMethodType;
    public route: string;
    public controllerMethod: string;
    public description: string;
}