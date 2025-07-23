'use client'
import dynamic from "next/dynamic";

export const TweetFetchDynamic = dynamic(() => import('feature/tweets/TweetsFetch.tsx'), {
  ssr: false,
})