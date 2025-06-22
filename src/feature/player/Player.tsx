import classNames from "classnames";
import {CSSProperties, useEffect, useRef, useState} from "react";
import {usePlayerStoreContext} from "@/feature/player/PlayerProvider.tsx";
import style from './Player.module.css'
import {ControlBar} from "@/feature/player/components/ControlBar/ControlsBar.tsx";
import {Loading} from "@/components/Loading/Loading.tsx";
import {MouseEvent} from "react";
import play from '@icons/svg/play.svg';
import {Icon} from "@/components/Icon/Icon.tsx";

type Props = {
  class?: string
  playerContainerStyle: string,
  hlsUrl?: string,
  preview?: string
  width?: number
  height?: number
}


const HOVER_DURATION = 2000

export function Player (props: Props) {
  const { hlsUrl, preview, width, height, playerContainerStyle } = props;
  const usePlayerStore = usePlayerStoreContext();
  const isCurrent = usePlayerStore(state => state.currentPlayerUrl === hlsUrl);
  const subscribe = usePlayerStore(state => state.subscribe);
  const unsubscribe = usePlayerStore(state => state.unsubscribe);
  const switchClosesPlayerPositionCheck = usePlayerStore(state => state.switchClosesPlayerPositionCheck);
  const initPlayer = usePlayerStore(state => state.initPlayer);
  const getCurrentUrl = usePlayerStore(state => state.getCurrentUrl);
  const isFirstRenderWithoutPlayer = usePlayerStore(state => state.players[hlsUrl || ' '] === undefined);
  const isPlaying = usePlayerStore(state => state.players[hlsUrl || ' ']?.isPlaying);
  const isLoading = usePlayerStore(state => state.players[hlsUrl || ' ']?.isLoading);
  const ended = usePlayerStore(state => state.players[hlsUrl || ' ']?.ended);
  const needPlayButton = usePlayerStore(state => state.needPlayButton);
  const isFullScreen = usePlayerStore(state => state.isFullScreen);
  const playVideo = usePlayerStore(state => state.play);
  const pause = usePlayerStore(state => state.pause);
  const getIsFullScreen = usePlayerStore(state => state.getIsFullScreen);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refVideoContainer = useRef<HTMLDivElement>(null);
  const switchFullScreen = usePlayerStore(state => state.switchFullScreen);
  const refVolumeChanging = useRef(false);
  const refVolumeChanged = useRef(false);
  const refIsClick = useRef(false);

  const pointerMove = () => {
    hover()
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHover(false);
      timeoutRef.current = null;
    }, HOVER_DURATION);

    if(hlsUrl) {
      subscribe(hlsUrl);

      return () => {
        unsubscribe(hlsUrl);
      }
    }
  }, []);


  const className = classNames(playerContainerStyle, style.playerContainer)
  let innerStyle: CSSProperties = {};

  if(width && height) {
    const paddingTop = height / width * 100 + '%';
    innerStyle = {
      paddingTop,
    }
  }

  function onMouseLeave(e: MouseEvent) {
    if(refVolumeChanging.current) {
      return
    }
    switchClosesPlayerPositionCheck(false);
  }


  function playButtonClickWithoutFullscreen (e: MouseEvent) {
    console.log('play click', isFullScreen)
    if(refVolumeChanging.current) {
      return
    }

    if(isFullScreen) {
      return;
    }

    e.preventDefault();
    if(!hlsUrl) {
      return
    }

    if(ended) {
      playVideo(hlsUrl)
      return;
    }

    if(checkIsSwipe()) {
      return;
    }

    if(isPlaying) {
      pause(hlsUrl)
      return;
    }

    playVideo(hlsUrl)
  }

  function checkIsSwipe () {
    return refTouchTime.current + 200 < Date.now()
  }

  function switchPlayOnClick (e: MouseEvent) {
    if(refVolumeChanging.current) {
      return
    }

    console.log('play by lick')
    e.preventDefault();
    if(!hlsUrl) {
      return
    }

    if(checkIsSwipe()) {
      return;
    }

    if(ended) {
      playVideo(hlsUrl)
      return;
    }

    if(isPlaying) {
      pause(hlsUrl)
      return;
    }

    playVideo(hlsUrl)
  }

  function hover() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsHover(false);
        timeoutRef.current = null;
      }, HOVER_DURATION);
    } else {
      setIsHover(true);
      timeoutRef.current = setTimeout(() => {
        setIsHover(false);
        timeoutRef.current = null;
      }, HOVER_DURATION);
    }
  }

  const imageClassName = classNames(style.preview)

  function pointerUp (e: React.PointerEvent) {
    hover()
    if(refVolumeChanging.current) {
      refVolumeChanging.current = false
      refVolumeChanged.current = true
      return
    }

    if(e.pointerType === 'touch' || e.pointerType === 'pen') {
      isTouchRef.current = true;
    }
  }

  function click (e: React.MouseEvent) {
    hover()
    if(refVolumeChanging.current) {
      refVolumeChanging.current = false;
      return
    }

    if(isTouchRef.current) {
      if(!getIsFullScreen()) {
        switchFullScreen(playerRef.current);
      }
    } else {
      switchClosesPlayerPositionCheck(true);
      if(refVideoContainer.current && hlsUrl) {
        if(getCurrentUrl() !== hlsUrl) {
          console.log('may play')
          initPlayer(hlsUrl, refVideoContainer.current);
        } else {
          if(!isPlaying || ended) {
            if(!checkIsSwipe()) {
              console.log('may play')
              playVideo(hlsUrl);
            }
          }
        }
      }
    }
  }

  const isTouchRef = useRef<boolean>(false);
  const isMoveTouch = useRef(false);
  const refTouchTime = useRef(0);

  function pointerDown() {
    refTouchTime.current = Date.now();
    refIsClick.current = false;

    refVolumeChanged.current = false
    if(refVolumeChanging.current) {
      return
    }

    isTouchRef.current = false
    isMoveTouch.current = false
  }

  function dragStart (e: React.DragEvent) {
    e.preventDefault();
  }

  return (
    <div onDragStart={dragStart} onPointerDown={pointerDown} onPointerUp={pointerUp} onClick={click} onPointerMove={pointerMove} onPointerLeave={onMouseLeave} className={className} style={innerStyle} >
      <div ref={playerRef} className={style.playerContainerBody}>
        <div className={style.playerPreviewContainer}>
          <img src={preview} className={imageClassName} loading='lazy'/>
        </div>
        <div className="videoContainer" ref={refVideoContainer} data-player-id={hlsUrl}>
          {/*container.prepend(video) from player store with one instance of player for autoplaying*/}
        </div>
        {!needPlayButton && isCurrent && isLoading !== undefined && isLoading === true && <Loading white={true} containerClass={style.spinner}/>}
        {!needPlayButton && isLoading === false && isFirstRenderWithoutPlayer || hlsUrl && isPlaying !== undefined && <ControlBar refVolumeChanging={refVolumeChanging} playButtonClickWithoutFullscreen={playButtonClickWithoutFullscreen} playButtonClick={switchPlayOnClick} ended={ended} playerRef={playerRef.current} isPlaying={isPlaying} isVisible={needPlayButton ? false : isHover} withVideo={isCurrent} id={hlsUrl}/>}
        {needPlayButton && <div onClick={switchPlayOnClick} className={style.playTargetContainer}>
          <button className={style.button}>
            <div className={style.circle}>
            </div>
            <Icon class={style.playSvg} url={play}/>
          </button>
        </div>}

        {ended && <div onClick={switchPlayOnClick} className={style.watchAgainContainer}>
          <button className={style.watchAgainButton}>Watch again</button>
        </div>}
      </div>
    </div>
  )
}