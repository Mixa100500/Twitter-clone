import {create, StateCreator, StoreApi, UseBoundStore} from "zustand";
import {devtools} from "zustand/middleware";


export const createStore = <T>(
  fn: StateCreator<T>,
  name?: string,
): UseBoundStore<StoreApi<T>> => {
  if(process.env.NODE_ENV === 'development') {
    if(name === undefined) {
      return create(fn)
    }

    return create(
      devtools(fn, { name })
    );
  }

  return create(fn)
}