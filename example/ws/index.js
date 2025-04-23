const {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} = require("@aws-sdk/client-apigatewaymanagementapi");

const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.LAMBDA_ENDPOINT,
});
const apiClient = new ApiGatewayManagementApiClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.API_GATEWAY_ENDPOINT,
});

exports.handler = async (event) => {
  if (event.requestContext.routeKey === "$connect") {
    console.log("Connected: ", event.requestContext.connectionId);
    return {
      statusCode: 200,
      body: "Connected.",
    };
  }

  if (event.requestContext.routeKey === "$disconnect") {
    console.log("DisConnected: ", event.requestContext.connectionId);
    return {
      statusCode: 200,
      body: "DisConnected.",
    };
  }

  if (event.requestContext.routeKey !== "sum") {
    return {
      statusCode: 400,
      body: "Not a valid action.",
    };
  }

  const command = new InvokeCommand({
    FunctionName: "worker",
    Payload: JSON.stringify({
      a: event.body.a,
      b: event.body.b,
    }),
  });

  const { Payload } = await lambdaClient.send(command);
  const result = Buffer.from(Payload).toString();

  await apiClient.send(
    new PostToConnectionCommand({
      ConnectionId: event.requestContext.connectionId,
      Data: result,
    })
  );

  return {
    statusCode: 200,
    body: "Message sent.",
  };
};
