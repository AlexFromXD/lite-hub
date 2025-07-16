# LiteHub

🪶 **LiteHub** is a lightweight function controller and API Gateway mock for local AWS Lambda development.  
Ideal for projects that need speed, flexibility, and **no cloud dependency**.

> Tired of heavy tools like [Serverless Offline](https://www.serverless.com/) or [LocalStack](https://www.localstack.cloud/)?  
> LiteHub is minimal, modular, and open for hacking.

---

## ✨ Features

- ✅ Mock **API Gateway (HTTP + WebSocket)** to trigger Lambda functions
- ✅ Mock **Lambda Invoke API** for internal Lambda-to-Lambda calls
- ✅ Simple `.env` configuration
- ✅ Supports `ConnectionId` routing and WebSocket responses
- ✅ Runs on plain Docker Compose, no AWS credentials required

---

## ⚙️ Configuration

LiteHub uses environment variables to configure function routing and behavior.

```env
FUNCTION_ENDPOINT=function-a=http://function-a-endpoint:8080,function-b=http://function-b-endpoint:8080

PATH_MAPPING=/function-a=function-a,/function-b=function-b

WS_FUNCTION=websocket

CORS_ALLOW_ORIGIN=http://localhost:5173,http://localhost:5174
```

- `FUNCTION_ENDPOINT`: map logical function names to container URLs
- `PATH_MAPPING`: map HTTP paths to Lambda functions
- `WS_FUNCTION`: WebSocket message router Lambda
- `CORS_ALLOW_ORIGIN`: comma-separated origins for CORS preflight

You can find an [example here](./example/README.md).

---

## 🤝 Contributing

LiteHub is in early development — contributions are **welcome** and encouraged!

Feel free to open issues, discussions, or pull requests.
