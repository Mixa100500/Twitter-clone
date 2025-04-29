import {Media, TweetAttachments} from "@/feature/tweets/types.ts";
import classNames from "classnames";
import style from "@/feature/tweets/tweets.module.css";
import {Image} from "@/components/Images/Image.tsx";
import {ReadyMedia} from "@/feature/tweets/components/ReadyMedia/ReadyMedia.tsx";

type RefMediaProps = TweetAttachments & {
  marginTop?: boolean,
  medias?: Media[],
}

export function RefMedia(props: RefMediaProps) {
  const { media_keys, medias, marginTop } = props

  if (!media_keys) {
    // no image
    return null
  }

  const notReady = () => {
    const isSingle = media_keys.length === 1

    if (isSingle) {
      const className = classNames(
        style.orange,
        'placeholder',
        marginTop && style.marginTop
      )
      return <div className={className}></div>
    }

    const className = classNames(
      style.fewImageContainer,
      marginTop && style.marginTop
    )

    return <div className={className}>
      <Image alt="Image" class={style.manyImage}/>
      <Image alt="Image" class={style.manyImage}/>
    </div>
  }

  if (!medias) {
    return notReady()
  }

  if(medias.length === 0) {
    return notReady()
  }

  return <ReadyMedia marginTop={marginTop} medias={medias}  />
}