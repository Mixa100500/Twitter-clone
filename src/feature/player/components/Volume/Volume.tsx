import {usePlayerStoreContext} from "@/feature/player/PlayerProvider.tsx";
import {MouseEvent, useRef, useState, memo} from "react";
import classNames from "classnames";
import style from "@/feature/player/components/ControlBar/ControlBar.module.css";
import {Icon} from "@/components/Icon/Icon.tsx";
import volumeOff from "@icons/svg/volumeOff.svg";
import volumeOn from "@icons/svg/volumeOn.svg";
type VolumeProps = {
  withVideo: boolean,
  refVolumeChanging: { current:  boolean },
}

export const Volume = memo(({ refVolumeChanging, withVideo }: VolumeProps) => {
  const usePlayer = usePlayerStoreContext();
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
    setHover(false);
  }

  function onRangeClick(e: MouseEvent) {
    e.preventDefault();
    if (!volumeControlRef.current) {
      return;
    }
    const rect = volumeControlRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const newVolume = 1 - mouseY / rect.height;

    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  }

  function mousemove(e: MouseEvent) {
    if (!volumeControlRef.current) {
      return;
    }
    if (!refVolumeChange.current) {
      return;
    }

    const rect = volumeControlRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const newVolume = 1 - mouseY / rect.height;

    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  }

  function mousedown(e: React.PointerEvent) {
    refVolumeChanging.current = true;
    refHover.current = true;
    refVolumeChange.current = true;
  }

  function mouseEnter(e: React.PointerEvent) {
    refHover.current = true;

    if(e.pointerType === 'touch' || e.pointerType === 'pen') {
      return
    }

    setHover(true);
  }

  const refBody = useRef<HTMLDivElement>(null);

  const dropUpBodyClassName = classNames(style.volumeDropUpBody, hover && style.volumeDropUpUpBodyShow);
  return (
    <div className={style.volumeContainer} onPointerLeave={mouseLeave}>
      <button className={style.volumeButton} onClick={() => {
        switchMute()
      }} onPointerEnter={mouseEnter}>
        <Icon class={style.svg} url={isMute ? volumeOn : volumeOff} />
      </button>
      {!isMute && withVideo && <div className={dropUpBodyClassName} ref={refBody} onClick={onRangeClick} onPointerDown={mousedown} onPointerMove={mousemove} onPointerUp={mouseUp}>
        <div className={style.volumeBarContainer} ref={volumeControlRef}>
          <div className={style.volumeBar}></div>
          <div style={{ height: `${volume * 100}%`}} className={style.volumeCurrent}></div>
          <div style={{ bottom: `${volume * 100}%`}} className={style.volumeCircle}></div>
        </div>
      </div>}
    </div>
  )
})

Volume.displayName = 'Volume'