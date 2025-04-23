type Task<T = unknown> = () => Promise<T>;

export class ThrottleQueue {
  private readonly _queue: Task[] = [];
  private _running = false;

  add<T>(task: Task<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrapped = async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };

      this._queue.push(wrapped);
      this._runNext();
    });
  }

  private async _runNext() {
    if (this._running || this._queue.length === 0) return;

    this._running = true;
    const task = this._queue.shift()!;
    try {
      await task();
    } finally {
      this._running = false;
      this._runNext();
    }
  }
}

/**
 * @description Since the Lambda RIE allows only one concurrent request, we need to throttle the requests to avoid errors.
 */
export class Throttle {
  private readonly _map = new Map<string, ThrottleQueue>();

  async add<T>(key: string, task: Task<T>): Promise<T> {
    if (!this._map.has(key)) {
      this._map.set(key, new ThrottleQueue());
    }

    const throttle = this._map.get(key)!;
    return throttle.add(task);
  }
}

export const throttle = new Throttle();
