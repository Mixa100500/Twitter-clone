import {MediasWithHls, TweetAttachments} from "@/feature/tweets/types.ts";
import {ReadyMedia} from "@/feature/tweets/components/ReadyMedia/ReadyMedia.tsx";

type TweetMediaProps = TweetAttachments & {
  marginTop?: boolean
  medias?: MediasWithHls,
}

export function TweetMedia (props: TweetMediaProps) {
  const { medias, marginTop } = props

  if(!medias) {
    return null
  }

  return <ReadyMedia marginTop={marginTop} medias={medias} />
}