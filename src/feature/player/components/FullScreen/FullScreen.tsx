import {usePlayerStoreContext} from "@/feature/player/PlayerProvider.tsx";
import style from "@/feature/player/components/ControlBar/ControlBar.module.css";
import {Icon} from "@/components/Icon/Icon.tsx";
import fullScreenClose from "@icons/svg/fullScreenClose.svg";
import fullScreenOpen from "@icons/svg/fullScreenOpen.svg";

type FullScreenProps = {
  playerRef: HTMLDivElement | null
}

export function FullScreen ({ playerRef }: FullScreenProps) {
  const usePlayer = usePlayerStoreContext();
  const isFullScreen = usePlayer(state => state.isFullScreen);
  const switchFullScreen = usePlayer(state => state.switchFullScreen);
  function toggle () {
    console.log('fullscreen')
    switchFullScreen(playerRef);
  }

  function onPoinerDown () {
    console.log('poinerdown on Fullscreen')
  }

  return <button className={style.fullScreenButton} onPointerUp={onPoinerDown} onClick={toggle}>
    <Icon class={style.svg} url={isFullScreen ? fullScreenClose : fullScreenOpen } />
    <Icon class={style.preloadSvg} url={fullScreenClose}/>
    <div className={style.fullscreenHover}></div>
  </button>
}