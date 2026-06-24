const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {

    definition: {

        openapi: "3.0.0",

        info: {
            title: "Student Success Auth API",
            version: "1.0.0"
        }
    },

    apis: []
};

const specs = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    specs
};
