type ThrottledFunction<
  T extends (...args: never[]) => unknown,
  Args extends Parameters<T> = Parameters<T>,
  Return extends ReturnType<T> = ReturnType<T>
> = {
  (...args: Args): Return | undefined;
  cancel: () => void;
};

export function throttle<
  T extends (...args: never[]) => unknown
>(
  func: T,
  limit: number
): ThrottledFunction<T> {
  let lastCall = 0;
  let timeoutId: number | undefined;

  const throttled = function(
    this: unknown,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      return func.apply(this, args) as ReturnType<T>;
    } else {
      if (timeoutId) window.clearTimeout(timeoutId);

      timeoutId = window.setTimeout(() => {
        lastCall = Date.now();
        func.apply(this, args);
      }, limit - (now - lastCall));
    }
  } as ThrottledFunction<T>;

  throttled.cancel = () => {
    if (timeoutId) window.clearTimeout(timeoutId);
  };

  return throttled;
}