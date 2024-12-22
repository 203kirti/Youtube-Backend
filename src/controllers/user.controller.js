import {asyncHandler} from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async (req, res) => {
    res.status(200).json({
        message:"ok" 
    })
})

export {registerUser}

// go on the postman http://localhost:8000/api/v1/users/register POST and send this  
// registerUser is an asynchronous function wrapped by asyncHandler.
// Parameters:
// req: Represents the HTTP request object, which contains data sent by the client    (eg., user input).
// res: Represents the HTTP response object, used to send data back to the client.
// It sends a JSON response with a 200 status code and a message "ok".
// When a POST request is made to /register, the registerUser function is called to handle the request.