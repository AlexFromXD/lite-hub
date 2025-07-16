/**
 * @ref https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-integration-requests.html
 */
export class WSRequest {
  /**
   * @description not important
   */
  headers = {};

  /**
   * @description not important
   */
  multiValueHeaders = {};

  isBase64Encoded: boolean = false;

  requestContext: {
    extendedRequestId: string;
    requestTime: string;
    messageDirection: "IN" | "OUT";
    stage: string;
    connectedAt: number;
    requestTimeEpoch: number;
    identity: { sourceIp: string };
    requestId: string;
    domainName: string;
    connectionId: string;
    apiId: string;
  } & (
    | ConnectRequestContext
    | DisConnectRequestContext
    | MessageRequestContext
  );

  /**
   * @description Only Message event has body
   */
  body: unknown = null;

  constructor(
    connectionId: string,
    context:
      | ConnectRequestContext
      | DisConnectRequestContext
      | MessageRequestContext,
    body?: unknown,
  ) {
    const apiId = "dIipa";
    const date = new Date();
    this.requestContext = {
      extendedRequestId: "ABCD1234=",
      requestTime: date.toISOString(),
      messageDirection: "IN",
      stage: "dev",
      connectedAt: date.getTime(),
      requestTimeEpoch: date.getTime(),
      identity: {
        sourceIp: "0.0.0.0",
      },
      requestId: "ABCD1234=",
      domainName: `${apiId}.execute-api.us-east-1.amazonaws.com`,
      connectionId,
      apiId,
      ...context,
    };

    if (body) {
      this.body = body;
    }
  }
}

type ConnectRequestContext = {
  routeKey: "$connect";
  eventType: "CONNECT";
};

type DisConnectRequestContext = {
  routeKey: "$disconnect";
  eventType: "DISCONNECT";
  disconnectStatusCode?: number;
  disconnectReason?: string;
};

type MessageRequestContext = {
  routeKey: string;
  eventType: "MESSAGE";
};
