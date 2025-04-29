import {MediaByKey, TweetLineNormalized} from "@/feature/tweets/types.ts";
import {firstResult, resultByToken} from "@/app/api/users/[id]/tweets/results.ts";
import {resultMediaByIds} from "@/app/api/media/[ids]/results.ts";
import {normalizeTweets, normalizeTweetsMedia} from "@/feature/tweets/normalised.ts";

export async function getTweets (id: string, paginationToken?: string ): Promise<TweetLineNormalized> {
  let url = '/api/users/' + id +'/tweets';
  if(paginationToken) {
    url += '?pagination_token=' + paginationToken;
  }
  return fetch(url)
    .then(res => res.json());
}

export async function getMedias (ids: string): Promise<MediaByKey> {
  console.log("ids from client: ", ids)
  return fetch('/api/media/' + ids)
    .then(res => res.json());
}
type Token = string | undefined
export async function getTweetServer (token: Token): Promise<TweetLineNormalized> {
  return normalizeTweets(firstResult)
}

export async function getTweetMediaServer (token: Token, ids: string): Promise<MediaByKey> {
  const result = resultMediaByIds[ids];
  return normalizeTweetsMedia(result)
}
