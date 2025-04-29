import {MouseEvent} from "react";
import classNames from "classnames";
import style from "@/feature/player/components/ControlBar/ControlBar.module.css";
import replay from "@icons/svg/replay.svg";
import pause from "@icons/svg/pause.svg";
import play from "@icons/svg/play.svg";
import {Icon} from "@/components/Icon/Icon.tsx";

type PlayProps = {
  id: string
  className: string,
  isPlaying: boolean,
  ended: boolean | undefined
  playButtonClick: (e: MouseEvent) => void
}

export function Play({ isPlaying, playButtonClick, ended, className}: PlayProps) {
  const classname = classNames(style.play, className)
  const iconUrl = ended ?  replay : (isPlaying ? pause : play)
  const ariaLabel = ended ? 'Replay' : isPlaying ? 'Pause' : 'Play';

  return <button aria-label={ariaLabel} className={classname} onClick={playButtonClick}>
    <Icon class={style.playSvg} url={iconUrl}/>
  </button>
}