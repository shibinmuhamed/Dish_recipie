// errorHandler.js
const errorHandler = (error, req, res, next) => {
    console.log(error); // logging the error here

    if (error.name === "ValidationError") {
        return res.status(400).send({
            type: "ValidationError",
            details: error.details,
        });
    }

    res.status(400).send(error.message); 
};

module.exports = errorHandler;
