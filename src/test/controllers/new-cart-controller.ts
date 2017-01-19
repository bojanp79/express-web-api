import {ApiController} from "../../decorators/api-controller";
import {ApiMethod} from "../../decorators/api-method";
import {HttpMethodType} from "../../entities/http-method-type";
import {Request, Response} from 'express';
import {transient,singleton,Container ,inject} from "aurelia-dependency-injection";


@ApiController()//"/Menu"
@inject(Container)
export class NewCartController {

    private static counter : number = 0;

    public name: string = "Bojan";
    public container : Container;

    constructor( container:Container){
        NewCartController.counter = NewCartController.counter  + 1;
        this.name = `Name: ${this.name} ${NewCartController.counter}`;
        this.container = container;
    }

    

    @ApiMethod(HttpMethodType.GET, "/Items")
    public test(req: Request, res: Response, next) {
        //console.log("called");
        this.name = `Bojan ${NewCartController.counter}`;
         NewCartController.counter = NewCartController.counter  + 1;
        res.json({name:this.name});
    }
}