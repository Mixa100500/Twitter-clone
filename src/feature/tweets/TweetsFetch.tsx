'use client'
import {TweetProvider} from "@/feature/tweets/TweetProvider.tsx";
import {Tweets} from "@/feature/tweets/Tweets.tsx";
import {useEffect, useState} from "react";
import {InitialTweet} from "@/feature/tweets/types.ts";
import {Loading} from "@/components/Loading/Loading.tsx";
import homeS from '../../app/home/home.module.css'
import {getTweetWithMediaServer} from "@/feature/tweets/ServerAction/getTweetWithMediaServer.ts";

export default function TweetsFetch () {
  // to do make virtual list and SSR;
  const [firstTweets, setFirstTweets] = useState<InitialTweet | undefined>();

  useEffect(() => {
    getTweetWithMediaServer().then(res => setFirstTweets(res))
  }, []);

  if(!firstTweets) {
    return <Loading containerClass={homeS.loader} ></Loading>
  }

  return <TweetProvider initialValue={firstTweets}>
    <Tweets />
  </TweetProvider>
}