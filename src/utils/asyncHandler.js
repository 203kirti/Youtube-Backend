const asyncHandler = (requestHandler) => {
    return  (req, res, next) => {
        Promise.resolve(requestHandler (req ,res , next)).catch((err) => next(err))
    }
}


export {asyncHandler}


 /*     EXPLAINATION 

    asyncHandler is likely a utility function or middleware that wraps asynchronous route handlers. 
    Its purpose is to handle errors in asynchronous functions gracefully, so you don't need to use try...catch blocks in every route handler.
    If an error occurs inside the wrapped function, asyncHandler will catch it and pass it to Express's error-handling middleware.


 */   
// try catch vala 

//high order functions 

// const asyncHandler = () => {}
// const asyncHandler = (func) => {}
// const asyncHandler = (func) => async () = {}

// const asyncHandler = (fn) => async (req , res , next ) => {
//     try{
//         await fn(req , res , next )
//     }catch(error){
//         res.status(err.code || 500 ).json({
//             success: false ,
//             message: err.message
//         }) // if user passing then err.code otherwise 500
//     }
// }