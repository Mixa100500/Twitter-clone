import {formatDateToShort} from "@/utils/fortmats/formatData.ts";
import style from "@/feature/tweets/tweets.module.css";
import {Image} from "@/components/Images/Image.tsx";
import {Icon} from "@/components/Icon/Icon.tsx";
import checkMark from "@icons/svg/checkMark.svg";

type HeaderProps = {
  name: string,
  username: string,
  dataTime: string,
  profileImage?: string,
}

export function TweetHeader (props: HeaderProps) {
  const { name, username, dataTime, profileImage } = props;
  const data = formatDateToShort(dataTime)

  return (
    <div className={style.header}>
      {profileImage && <Image alt={'profile picture'} class={style.innerProfilePicture} src={profileImage} />}
      <div className={style.headerLeft}>
        <span className={style.name}>{name}</span>
        <Icon url={checkMark} class={style.checkMark}/>
      </div>
      <div className={style.headerMiddle}>
        <span className={style.username}>
          @{username}
        </span>
        <span className={style.dot}>
          ·
        </span>
        <time className={style.time} dateTime={dataTime}>
          {data}
        </time>
      </div>
    </div>
  )
}