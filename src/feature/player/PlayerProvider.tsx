'use client'

import {createContext, ReactNode, useContext, useRef} from "react";
import {createPlayerStore} from "@/feature/player/store.ts";

type Props = {
  children: ReactNode,
}

export type PlayerStoreApi = ReturnType<typeof createPlayerStore>

export const PlayerStoreContext = createContext<PlayerStoreApi | undefined>(
  undefined,
)

export function PlayerProvider ({children}: Props) {
  const storeRef = useRef<PlayerStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createPlayerStore()
  }

  return (
    <PlayerStoreContext.Provider value={storeRef.current}>
      {children}
    </PlayerStoreContext.Provider>
  )
}

export function usePlayerStoreContext (): PlayerStoreApi {
  const playerStoreContext = useContext(PlayerStoreContext)

  if (!playerStoreContext) {
    throw new Error(`usePlayerStore must be used within PlayerStoreContext`)
  }

  return playerStoreContext
}