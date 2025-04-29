import {usePlayerStoreContext} from "@/feature/player/PlayerProvider.tsx";
import {MouseEvent, useMemo, useRef, useState} from "react";
import {throttle} from "@/utils/throttle.ts";
import classNames from "classnames";
import style from "@/feature/player/components/ControlBar/ControlBar.module.css";
import {Icon} from "@/components/Icon/Icon.tsx";
import volumeOff from "@icons/svg/volumeOff.svg";
import volumeOn from "@icons/svg/volumeOn.svg";
type VolumeProps = {
  withVideo: boolean,
}

export function Volume ({ withVideo }: VolumeProps) {
  const usePlayer = usePlayerStoreContext()
  const isMute = usePlayer(state => state.isMute);
  const switchMute = usePlayer(state => state.switchMute);
  const volume = usePlayer(state => state.volume);
  const setVolume = usePlayer(state => state.setVolume);
  const [hover, setHover] = useState(false);
  const refHover = useRef(false);
  const refVolumeChange = useRef(false);
  const volumeControlRef = useRef<HTMLDivElement>(null);

  function mouseUp(e: MouseEvent) {
    e.preventDefault();
    refHover.current = false;
    refVolumeChange.current = false;
  }

  function mouseLeave(e: MouseEvent) {
    e.preventDefault();
    refHover.current = false;
    refVolumeChange.current = false;
    setHover(false)
  }

  const throttleMouseMove = useMemo(() => {
    return throttle(mousemove, 30)
  }, []);

  function onRangeClick(e: MouseEvent) {
    e.preventDefault();
    if(!volumeControlRef.current) {
      return;
    }
    const rect = volumeControlRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const newVolume = 1 - mouseY / rect.height;

    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  }

  function mousemove(e: MouseEvent) {
    e.preventDefault();
    if(!volumeControlRef.current) {
      return;
    }
    if(!refVolumeChange.current) {
      return;
    }

    const rect = volumeControlRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const newVolume = 1 - mouseY / rect.height;

    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  }

  function mousedown(e: MouseEvent) {
    e.preventDefault()
    refHover.current = true;
    refVolumeChange.current = true;
  }

  function mouseEnter(e: MouseEvent) {
    e.preventDefault();
    refHover.current = true;
    setHover(true)
  }

  const dropUpBodyClassName = classNames(style.volumeDropUpBody, hover && style.volumeDropUpUpBodyShow)
  return (
    <div className={style.volumeContainer} onMouseLeave={mouseLeave}>
      <button className={style.volumeButton} onClick={() => switchMute()} onMouseEnter={mouseEnter}>
        <Icon class={style.svg} url={isMute ? volumeOff : volumeOn} />
      </button>
      {isMute && withVideo && <div className={dropUpBodyClassName} onClick={onRangeClick} onMouseDown={mousedown} onMouseMove={throttleMouseMove} onMouseUp={mouseUp}>
        <div className={style.volumeBarContainer} ref={volumeControlRef}>
          <div className={style.volumeBar}></div>
          <div style={{ height: `${volume * 100}%`}} className={style.volumeCurrent}></div>
          <div style={{ bottom: `${volume * 100}%`}} className={style.volumeCircle}></div>
        </div>
      </div>}
    </div>
  )
}