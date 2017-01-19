
export class TestController{

    public get(){
        return {name:'Bojan' , age :37};
    }

    public post(item:any,item2:any){
        return {name:'POST :Bojan' , age :37};
    }

   /**
    *  GET = <any>"get",
    POST = <any>"post",
    PUT = <any>"put",
    DELETE = <any>"delete",
    PATCH = <any>"patch",
    OPTIONS = <any>"options",
    HEAD = <any>"head"
    */
}