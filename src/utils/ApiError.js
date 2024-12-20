class ApiError extends Error{
    constructor(
        statusCode, 
        message = "Something went wrong",  
        errors =[],
        stack =""
    ){
        super(message)
            this.statusCode = statusCode
            this.data= null
            this.message=message
            this.success=false;
            this.errors =errors


            if(stack){
                this.stack = stack
            }else{
                Error.captureStackTrace(this, this.constructor)
            }
    }
}

export {ApiError}



//   The ApiError class  created is a robust way to handle and structure errors in backend project. It extends the built-in Error class and provides additional properties to include more context about the error

//  statusCode:  Indicates the HTTP status code representing the type of error (e.g., 400 for Bad Request, 500 for Internal Server Error).
// message : A human-readable message describing the error. Defaults to "Something went wrong".
// errors: An array to store detailed validation errors or additional error information.
//  stack:  Captures the stack trace for debugging purposes. If a custom stack is provided, it uses that; otherwise, it generates a stack trace using Error.captureStackTrace.



