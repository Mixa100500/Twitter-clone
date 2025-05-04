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
  // imageStyle: string,
  // variants?: Variants
  hlsUrl?: string,
  preview?: string
  width?: number
  height?: number
}

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
  console.log('isPlaying component', isPlaying)
  const isLoading = usePlayerStore(state => state.players[hlsUrl || ' ']?.isLoading);
  const ended = usePlayerStore(state => state.players[hlsUrl || ' ']?.ended);
  const needPlayButton = usePlayerStore(state => state.needPlayButton);
  const playVideo = usePlayerStore(state => state.play);
  const pause = usePlayerStore(state => state.pause);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refVideoContainer = useRef<HTMLDivElement>(null);

  const mouseMove = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsHover(false);
        timeoutRef.current = null;
      }, 2000);
    } else {
      setIsHover(true);
      timeoutRef.current = setTimeout(() => {
        setIsHover(false);
        timeoutRef.current = null;
      }, 2000);
    }
  };

  useEffect(() => {

    if(hlsUrl) {
      subscribe(hlsUrl);

      return () => {
        unsubscribe(hlsUrl);
      }
    }
  }, []);


  const className = classNames(playerContainerStyle, style.playerContainer)
  let aspectRatio: string;
  let innerStyle: CSSProperties = {};

  if(width && height) {
    aspectRatio = `${width}/${height}`
    innerStyle = {
      aspectRatio,
    }
  }

  function onMouseEnter(e: MouseEvent) {
    console.log('mouse enter')
    e.preventDefault();
    switchClosesPlayerPositionCheck(true);
    if(refVideoContainer.current && hlsUrl) {

      if(getCurrentUrl() !== hlsUrl) {
        console.log('url', getCurrentUrl(), hlsUrl)
        initPlayer(hlsUrl, refVideoContainer.current);
      } else {
        if(!isPlaying || ended) {
          playVideo(hlsUrl);
        }
      }
    }
  }

  function onMouseLeave(e: MouseEvent) {
    e.preventDefault();

    switchClosesPlayerPositionCheck(false);
  }

  function playButtonClick (e: MouseEvent) {
    console.log('start click')
    e.preventDefault();
    if(!hlsUrl) {
      return
    }

    if(ended) {
      console.log('play')
      playVideo(hlsUrl)
      return;
    }
    console.log('isPlaying', isPlaying)
    if(isPlaying) {
      console.log('pause')
      pause(hlsUrl)
      return;
    }

    console.log('play')
    playVideo(hlsUrl)
  }

  const imageClassName = classNames(style.preview)

  return (
    <div ref={playerRef} onPointerMove={mouseMove} onMouseEnter={onMouseEnter} onPointerLeave={onMouseLeave} className={className} style={innerStyle} >
      <img draggable="false" src={preview} className={imageClassName} loading='lazy'/>
      <div className="videoContainer" ref={refVideoContainer} data-player-id={hlsUrl}>
        {/*container.prepend(video) from player store with one instance of player for autoplaying*/}
      </div>
      {!needPlayButton && isCurrent && isLoading !== undefined && isLoading === true && <Loading white={true} containerClass={style.spinner}/>}
      {!needPlayButton && isLoading === false && isFirstRenderWithoutPlayer || hlsUrl && isPlaying !== undefined && <ControlBar playButtonClick={playButtonClick} ended={ended} playerRef={playerRef.current} isPlaying={isPlaying} isVisible={needPlayButton ? false : isHover} withVideo={isCurrent} id={hlsUrl}/>}
      {needPlayButton && <div onClick={playButtonClick} className={style.playTargetContainer}>
        <button className={style.button} >
          <div className={style.circle}>
          </div>
          <Icon class={style.playSvg} url={play}/>
        </button>
      </div>}
      {ended && <div className={style.watchAgainContainer}>
        <button onClick={playButtonClick} className={style.watchAgainButton}>Watch again</button>
      </div>}
    </div>
  )
}