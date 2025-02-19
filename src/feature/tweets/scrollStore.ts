interface Store {
  topElementId: string | null,
  top: number | null,
  setTop: (top: number | null, topElementId: string | null) => void,
  getTop: () => number | null,
}


import {createStore} from "@/feature/createStore.ts";
export const useScroll = createStore<Store>((set, get) => ({
  topElementId: null,
  top: null,
  setTop: (top, topElementId) => {
    set({
      top,
      topElementId
    })
  },
  getTop: () => {
    return  get().top
  }
}))