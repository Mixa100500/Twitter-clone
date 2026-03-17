import { create, StoreApi, StateCreator, UseBoundStore } from 'zustand';
import { devtools } from 'zustand/middleware';


/**
 * Factory that returns [useStore, mockStore]
 *
 * - useStore: stable proxy hook (use like normal zustand hook)
 * - mockStore(partial) : quick partial override
 * - mockStore.creator(fn): typed fn that returns Partial<T>
 * - mockStore.reset(): restore original store
 */

export function makeStore<T extends object>(fn: StateCreator<T>, name?: string) {
  const createHook = (creator: StateCreator<T>) =>
    process.env.NODE_ENV === 'development' && name
      ? create(devtools(creator, { name }))
      : create(creator);

  // current real hook instance
  let realHook: UseBoundStore<StoreApi<T>> = createHook(fn);

  // stable proxy hook returned to consumers

  function useStore(): T;
  function useStore<U>(selector: (state: T) => U): U;
  function useStore<U>(selector?: (state: T) => U) {
    return selector ? realHook(selector) : realHook();
  }

  // derive (set, get, api) parameter types from StateCreator<T>
  type CParams = Parameters<StateCreator<T>>; // [set, get, api]
  type SetType = CParams[0];
  type GetType = CParams[1];
  type ApiType = CParams[2];

  // apply a Partial<T> override
  const applyPartial = (partial: Partial<T>) => {
    const mergedCreator: StateCreator<T> = (set: SetType, get: GetType, api: ApiType) => {
      const base = fn(set, get, api);
      return Object.assign({}, base, partial) as T;
    };
    realHook = createHook(mergedCreator);
    return realHook;
  };

  // apply a part-creator function: (set,get,api) => S where S is exact Partial<T>
  const applyPartCreator = <S extends Partial<T> & Record<Exclude<keyof S, keyof T>, never>>(
    partCreator: (set: SetType, get: GetType, api: ApiType) => S
  ) => {
    const mergedCreator: StateCreator<T> = (set: SetType, get: GetType, api: ApiType) => {
      const base = fn(set, get, api);
      const extra = partCreator(set, get, api) || ({} as S);
      return Object.assign({}, base, extra) as T;
    };
    realHook = createHook(mergedCreator);
    return realHook;
  };

  // callable mockStore: convenient default to pass Partial<T>
  function mockStore(partial?: Partial<T>) {
    return applyPartial(partial ?? ({} as Partial<T>));
  }

  // attach strongly-typed creator method:
  mockStore.creator = <S extends Partial<T> & Record<Exclude<keyof S, keyof T>, never>>(
    creator: (set: SetType, get: GetType, api: ApiType) => S
  ) => applyPartCreator<S>(creator);

  return [useStore, mockStore] as const;
}




