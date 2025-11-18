declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * Logical function names that intend to support AWS API Gateway v1 payload format
       *
       * @see {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-rest-api.html}
       */
      HTTP_V1_PAYLOAD_FUNCTIONS: string | undefined;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
