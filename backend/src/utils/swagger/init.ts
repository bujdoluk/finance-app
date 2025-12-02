import swaggerJsDoc from "swagger-jsdoc";

export const options = {
  apis: ["./src/user/docs.ts"],
  definition: {
    info: {
      description: "A simple personal finance tracking API",
      title: "Finance API",
      version: "1.0.0"
    },
    openapi: "3.0.0",
    servers: [
      {
        url: "http://localhost:3001"

      }
    ]
  }
}

const specs = swaggerJsDoc(options);

export default specs;