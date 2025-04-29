import {cookies} from "next/headers";
import {cookiesMap} from "@/utils/config.ts";
import {AUTHORIZATION} from "../../../next.config.ts";
import {TweetProvider} from "@/feature/tweets/TweetProvider.tsx";
import {getTweetWithMediaServer} from "@/feature/tweets/tweetStore.ts";
import {Tweets} from "@/feature/tweets/Tweets.tsx";

export async function TweetServer () {
  const cookieStore = await cookies();
  const access = cookieStore.get(cookiesMap.accessToken)?.value;
  const token = access ? access : AUTHORIZATION;
  const tweetsTimeline = await getTweetWithMediaServer(token);

  return <TweetProvider initialValue={tweetsTimeline}>
    <Tweets />
  </TweetProvider>
}