/**
 * @description Controller that and handles different types of function invocation and lifecycle events.
 */
export interface Controller {
  init(): void;
  shutdown(): void;
}
