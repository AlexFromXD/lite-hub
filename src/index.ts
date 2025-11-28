import { HttpController } from "./controller/http-controller";
import { LambdaController } from "./controller/lambda-controller";
import { WSController } from "./controller/ws-controller";

const httpController = new HttpController();
const wsController = new WSController();
const lambdaController = new LambdaController();

httpController.init();
wsController.init();
lambdaController.init();

//#region Graceful Shutdown
const shutdownControllers = () => {
  httpController.shutdown();
  wsController.shutdown();
  lambdaController.shutdown();
};

process.on("SIGTERM", async () => {
  shutdownControllers();
  process.exit(0);
});

process.on("SIGINT", async () => {
  shutdownControllers();
  process.exit(0);
});
//#endregion
