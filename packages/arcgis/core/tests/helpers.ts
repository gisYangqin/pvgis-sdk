declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    require: any
  }
}

export function stubRequire() {
  window.require = function (
    moduleNames: string[],
    callback: (...args: unknown[]) => unknown
  ) {
    if (callback) {
      // call the callback w/ the module names that were passed in
      callback.apply(this, moduleNames)
    }
  }
  window.require.on = () => {
    return {
      /* tslint:disable no-empty */
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      remove() {},
      /* tslint:enable no-empty */
    }
  }
}

// remove previously stubbed require function
export function removeRequire() {
  delete window.require
}
