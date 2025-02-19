import {MediaByKey, TweetLineNormalized} from "@/feature/tweets/types.ts";

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