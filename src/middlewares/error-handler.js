

const error_handler = (err, req, res, next) => {
    console.log("Middleware Error Hadling");
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
   return res.status(errStatus).render('error-handler.ejs', {
        success: false,
        message: errMsg,
        status:errStatus,
    });
    
};








module.exports = error_handler;