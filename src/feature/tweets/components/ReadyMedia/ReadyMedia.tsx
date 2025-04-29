import {MediasWithHls} from "@/feature/tweets/types.ts";
import classNames from "classnames";
import style from "@/feature/tweets/tweets.module.css";
import {Image} from "@/components/Images/Image.tsx";
import {Player} from "@/feature/player/Player.tsx";

type ReadyMediaProps = {
  medias: MediasWithHls
  marginTop?: boolean
}

export function ReadyMedia (props: ReadyMediaProps) {
  const { medias, marginTop } = props
  if(medias[0].type === 'photo') {

    if(medias.length === 1) {
      const media = medias[0]
      const url = media.url?.slice(0, -4)
      const classname = classNames(
        style.oneImage,
        marginTop && style.marginTop
      )

      return <div className={style.oneImageContainer}><Image
        class={classname}
        srcSet={`
          ${url}?format=jpg&name=240x240 240w, 
          ${url}?format=jpg&name=360x360 360w, 
          ${url}?format=jpg&name=small 480w`}

        sizes="(max-width: 300px) 240px,(max-width: 420px) 360px,480px"
        key={media.media_key}
        src={media.url}
        alt="Image"
        loading='lazy'
      /></div>
    }

    const classname = classNames(
      style.fewImageContainer,
      marginTop && style.marginTop
    )

    return <div className={classname}>
      {medias.map(media => {
        const url = media.url?.slice(0, -4);
        const isPhoto = media.type === 'photo';
        const isVideo = media.type === 'video';

        if(isPhoto) {
          return (
            <Image
              class={style.manyImage}
              srcSet={`
              ${url}?format=jpg&name=240x240 240w,
              ${url}?format=jpg&name=360x360 360w`
              }

              sizes="(max-width: 540px) 240px,360px"
              src={media.url}
              alt="Image"
              key={media.media_key}
              loading='lazy'
            />
          )
        }

        if(isVideo) {
          // const variants = media.variants
          const hlsUrl = media?.hlsUrl
          const classname = classNames(
            style.manyImage,
          )
          // const hlsUrl = variants?.find((variant => variant.content_type === 'application/x-mpegURL'))?.url

          return (
            <Player playerContainerStyle={classname} width={media.width} height={media.height} hlsUrl={hlsUrl} preview={media.preview_image_url} key={media.media_key}/>
          )
        }
      })}
    </div>
  }
  const media = medias[0]
  const hlsUrl = medias[0]?.hlsUrl

  const classname = classNames(
    style.oneVideo,
    marginTop && style.marginTop
  )

  return (
    <Player playerContainerStyle={classname} width={media?.width} height={media?.height} hlsUrl={hlsUrl} preview={medias[0].preview_image_url} />
  )
}