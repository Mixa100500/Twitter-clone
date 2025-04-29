'use client'

import {InitialTweet} from "@/feature/tweets/types.ts";
import {createContext, ReactNode, useContext, useRef} from "react";
import {createPlayerStore} from "@/feature/tweets/tweetStore.ts";

type Props = {
  initialValue: InitialTweet,
  children: ReactNode,
}

export type TweetStoreApi = ReturnType<typeof createPlayerStore>

export const TweetStoreContext = createContext<TweetStoreApi | undefined>(
  undefined,
)

export function TweetProvider ({ initialValue, children }: Props) {
  const storeRef = useRef<TweetStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createPlayerStore(initialValue)
  }

  return (
    <TweetStoreContext.Provider value={storeRef.current}>
      {children}
    </TweetStoreContext.Provider>
  )
}

export function useTweetStore (): TweetStoreApi {
  const tweetStoreContext = useContext(TweetStoreContext)

  if (!tweetStoreContext) {
    throw new Error(`useTweetStore must be used within TweetStoreContext`)
  }

  return tweetStoreContext
}