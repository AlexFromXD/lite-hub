## 🚀 Quick Start

```sh
cd ./example
docker compose up
```

### 🔗 HTTP API

```sh
curl http://localhost:3000/api
```

### 📡 WebSocket API

```sh
wscat -c ws://localhost:3001
# Then type:
> {"action": "sum", "a": 1, "b": 1}
# Expect:
< {"ans": 2}
```

---

## 🐳 Docker & Compose

- The main `Dockerfile` builds the LiteHub service for local use
- See [docker-compose.yaml](./docker-compose.yaml) for a multi-service setup (http, ws, worker, lite-hub)
- Environment variables control routing and function mapping

---

## 🤝 Contributing

LiteHub is in early development — contributions are **welcome** and encouraged!

Feel free to open issues, discussions, or pull requests.
