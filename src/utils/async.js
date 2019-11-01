// @flow

export const mapAsync = <T, U>(
  array: Array<T>,
  callbackfn: (item: T, index: number, array: Array<T>) => Promise<U> | U
): Promise<Array<U>> =>
  Promise.all(array.map((item, index) => Promise.resolve(callbackfn(item, index, array))));

export const filterAsync = <T>(
  array: Array<T>,
  callbackfn: (item: T, index: number, array: Array<T>) => Promise<boolean> | boolean
): Promise<Array<T>> =>
  mapAsync(array, callbackfn).then(result => array.filter((item, index) => result[index]));

export class Mutex {
  mutex = Promise.resolve();

  lock(): Promise<() => void> {
    let begin: (() => void) => void = () => {};

    this.mutex = this.mutex.then(() => {
      return new Promise(begin);
    });

    return new Promise(res => {
      begin = res;
    });
  }

  async dispatch<T>(fn: (() => T) | (() => Promise<T>)): Promise<T> {
    const unlock = await this.lock();

    try {
      return await Promise.resolve(fn());
    } finally {
      unlock();
    }
  }
}
