import {ApiMethodInfo} from "./api-method-info";

export class ApiControlerInfo {
    
    public name: string;
    public route: string;
    public description: string;
    public fn: any;

    public methods: ApiMethodInfo[];

    constructor() {
        this.methods = [];
    }
}
