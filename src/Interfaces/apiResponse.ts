export default interface apiResponse{
    data? : {
        statusCode? : number;
        isSuccess? : boolean;
        errorMessages? : Array<string>; 
        result: {
            [key:string] : string;
        };
    };
    error? : any; //오류 포착 
}

//api response