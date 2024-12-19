class ApiResponse{
    constructor(statusCode , data, message="Success"){
        this.statusCode=statusCode
        this.message=message
        this.data=data
        this.success=statusCode < 400
    }
}

//  The ApiResponse class created is a utility to standardize responses from  backend API. It encapsulates essential details such as status code, data, message, and success status. 

//  statusCode: Indicates the HTTP status code of the response (e.g., 200 for success, 404 for not found, etc.).

//  data: Contains the payload or result of the API request (e.g., user data, list of items).

//  message: A human-readable message describing the outcome of the request. Defaults to "Success".

// success: A boolean derived from the statusCode to indicate whether the request was successful (true if statusCode < 400).