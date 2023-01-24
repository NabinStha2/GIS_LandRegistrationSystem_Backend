const { changeResponse, swapQueryAndBody } = require("./extraWork");

const options = { openapi: "3.0.0", autoBody: true };

const swaggerAutogen = require("swagger-autogen")(options);
// const doc = {
//     info: {
//         "version": "",                // by default: "1.0.0"
//         "title": "",                  // by default: "REST API"
//         "description": ""             // by default: ""
//     },
//     host: "",                         // by default: "localhost:3000"
//     basePath: "",                     // by default: "/"
//     schemes: [],                      // by default: ['http']
//     consumes: [],                     // by default: ['application/json']
//     produces: [],                     // by default: ['application/json']
//     tags: [                           // by default: empty Array
//         {
//             "name": "",               // Tag name
//             "description": ""         // Tag description
//         },
//         // { ... }
//     ],
//     securityDefinitions: { },         // by default: empty object
//     definitions: { }                  // by default: empty object
// }

//!Paste this in every controller with the data

/*    
      #swagger.parameters['obj'] = {
                in: 'query',
                description: 'Adding new user.',
                schema: {
                    $name: 'LocationName',
                    $coordinates: [21,21],
                    type: "Point",
                    description:"this is descp"
                }
        } 
    */

const doc = {
  // { ... },
  host: "192.168.1.97:5000",
  basePath: "/",
  schemes: ["http", "https"], // by default: "/"
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header", // can be 'header', 'query' or 'cookie'
      name: "X-API-KEY", // name of the header, query parameter or cookie
      description: "Some description...",
    },
  },
  info: {
    title: "GIS Land Registration System API", // short title.
    description: "A land registration system API for land buy sell with GIS.", //  desc.
    version: "1.0.0", // version number
    contact: {
      name: "Nabin Shrestha",
      email: "nabinstha246@gmail.com",
    },
  },

  // examples: {
  //     User:{
  //         value:{
  //             name: 'Jhon Doe',
  //             age: 29
  //         },
  //         summary: "Sample for User"
  //     }
  // }
};

const outputFile = "./helpers/swagger/swagger_output.json";
const endpointsFiles = ["./server.js"];

const swaggerFunc = async () => {
  try {
    const script = await swaggerAutogen(outputFile, endpointsFiles, doc);
    // changeResponse()
    swapQueryAndBody();

    console.log("🚀 ~ file: swagger.js ~ line 49 ~ script");
  } catch (error) {
    console.log("🚀 ~ file: swagger.js ~ line 50 ~ error", error);
  }
};

swaggerFunc();
