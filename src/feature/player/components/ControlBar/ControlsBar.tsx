import style from './ControlBar.module.css'
import {usePlayerStoreContext} from "@/feature/player/PlayerProvider.tsx";
import {useEffect, useRef, useState, MouseEvent, useMemo} from "react";
import {BufferRanges} from "@/feature/player/store.ts";
import classNames from "classnames";
import {formatTimer} from "@/utils/fortmats/formatTimer.ts";
import {Volume} from "@/feature/player/components/Volume/Volume.tsx";
import {FullScreen} from "@/feature/player/components/FullScreen/FullScreen.tsx";
import {Play} from "@/feature/player/components/Play/Play.tsx";
import {BufferBar} from "@/feature/player/components/BufferBar/BufferBar.tsx";
import {CurrentBar} from "@/feature/player/components/CurrentBar/CurrentBar.tsx";
import {log} from "next/dist/server/typescript/utils";

type PropsControlBar = {
  id: string
  withVideo: boolean
  isVisible: boolean
  isPlaying: boolean
  playerRef: HTMLDivElement | null
  refVolumeChanging:  { current: boolean },
  ended: boolean | undefined
  playButtonClick: (e: MouseEvent) => void
  playButtonClickWithoutFullscreen: (e: MouseEvent) => void
}

function haveBufferRangesChanged(
  oldRanges: BufferRanges,
  newRanges: BufferRanges
): boolean {
  if (oldRanges.length !== newRanges.length) {
    return true;
  }

  for (let i = 0; i < oldRanges.length; i++) {
    const oldRange = oldRanges[i];
    const newRange = newRanges[i];

    if (oldRange.start !== newRange.start || oldRange.end !== newRange.end) {
      return true;
    }
  }
  return false;
}

export function ControlBar ({refVolumeChanging, id, withVideo, isVisible, isPlaying, playerRef, ended, playButtonClick, playButtonClickWithoutFullscreen }: PropsControlBar) {
  const usePlayer = usePlayerStoreContext();
  const getProgress = usePlayer(state => state.getProgress);
  const getVideo = usePlayer(state => state.getVideo);
  const [progress, setProgress] = useState(0);
  const [buffers, setBuffers] = useState<BufferRanges>([]);
  const [duration, setDuration] = useState<number | undefined>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [timeLineActive, setTimeLineActive] = useState<boolean>(false);
  const refTimeline = useRef<HTMLDivElement>(null);
  const stopCheckUseEffect = useRef(false);
  const refSwipeTimeOut = useRef<number>(0);
  const visible = isVisible ? '' : style.hide;
  const visibleContainer = classNames(isVisible ? '' : style.hide, style.hideContainer);
  const refInitialSwipeX = useRef(0);
  const refInitialProgress = useRef(0);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | undefined
    if(withVideo) {
      function updateBar () {
        if(stopCheckUseEffect.current) {
          return
        }
        const { progress, buffers: newBuffers, duration, currentTime } = getProgress(id)
        setBuffers(prev => {
          if(haveBufferRangesChanged(prev, newBuffers)) {
            return newBuffers
          }
          return prev
        })
        setCurrentTime(currentTime)
        setProgress(progress)
        setDuration(duration)
      }
      timerId = setInterval(updateBar, 500)
    }
    return () => {
      if(timerId !== undefined) {
        clearInterval(timerId)
      }
    }

  }, [withVideo]);
  
  function mouseUp(e: MouseEvent) {
    if(refVolumeChanging.current) {
      return
    }

    stopCheckUseEffect.current = false;
  }

  function pointerUp(e: React.PointerEvent) {
    if(refVolumeChanging.current) {
      return
    }

    // if(e.pointerType === 'mouse' || e.pointerType === 'touch') {
    setTimeLineActive(false);
    stopCheckUseEffect.current = false;
    // }
  }

  function timeLineClick(e: MouseEvent) {
    if(refVolumeChanging.current) {
      return
    }

    e.preventDefault();
    if(!withVideo) {
      return;
    }

    if(refTimeline.current) {
      const rect = refTimeline.current.getBoundingClientRect();
      let pos = (e.clientX - rect.left) / rect.width;
      pos = Math.max(0, Math.min(1, pos));
      const video = getVideo();

      if(duration && video) {
        const currentTime = duration * pos;
        const newPosition = currentTime / duration * 100
        video.currentTime = currentTime;
        setCurrentTime(currentTime)
        setProgress(newPosition)
      }
    }
  }


  function pointerMove (e: React.PointerEvent) {
    if(refVolumeChanging.current) {
      return
    }
    if(!withVideo) {
      return;
    }

    if(e.pointerType === 'touch' || e.pointerType === 'pen') {
      if(refSwipeTimeOut.current + 200 > Date.now() ) {
        return;
      }
    }
    if (refTimeline.current && stopCheckUseEffect.current) {
      const rect = refTimeline.current.getBoundingClientRect();
      const deltaX = e.clientX - refInitialSwipeX.current;
      const deltaProgress = deltaX / rect.width;
      let newProgress = refInitialProgress.current + deltaProgress;

      newProgress = Math.max(0, Math.min(1, newProgress));

      const video = getVideo();
      if (duration && video) {
        video.currentTime = duration * newProgress;
        setCurrentTime(duration * newProgress);
        setProgress(newProgress * 100);
      }
    }
    // if(refTimeline.current && stopCheckUseEffect.current) {
    //   const rect = refTimeline.current.getBoundingClientRect();
    //   const initialX = refInitialSwipeX.current;
    //   const currentX = e.clientX;
    //   const deltaX = currentX - initialX;
    //
    //   let pos = (refInitialProgressPos.current + deltaX / rect.width);
    //
    //   // let pos = (e.clientX - rect.left) / rect.width;
    //   // pos = Math.max(0, Math.min(1, pos));
    //   const video = getVideo();
    //   pos = Math.max(0, Math.min(1, pos));
    //
    //   if(duration && video) {
    //     const currentTime = duration * pos
    //     const newPosition = currentTime / duration * 100
    //     video.currentTime = currentTime;
    //     setCurrentTime(currentTime)
    //     setProgress(newPosition)
    //   }
    // }
  }

  function onPointerDown(e: React.PointerEvent) {
    if(refVolumeChanging.current) {
      return
    }

    if (refTimeline.current) {
      const rect = refTimeline.current.getBoundingClientRect();
      refInitialSwipeX.current = e.clientX;
      refInitialProgress.current = progress / 100;
    }

    refSwipeTimeOut.current = Date.now()

    setTimeLineActive(true);
    stopCheckUseEffect.current = true;
  }

  const timeLineClassName = classNames(style.timeLine, timeLineActive && style.timeLineActive)
  const barLeftClassname = classNames(style.barRight, !isVisible && style.hide)

  const refTarget = useRef<HTMLDivElement | null>(null)

  return (
    <>
      <div className={style.mouseLeaveTarget} ref={refTarget} onPointerMove={pointerMove} onPointerLeave={pointerUp} onMouseUp={mouseUp} onPointerUp={pointerUp} onPointerCancel={pointerUp} onPointerDown={onPointerDown}>
        <div className={style.mouseTargetPlay} onClick={playButtonClickWithoutFullscreen}></div>
        <div className={style.bar} >
          <div className={timeLineClassName} ref={refTimeline} onClick={timeLineClick}>
            <div className={visibleContainer}>
              {duration !== undefined && <BufferBar buffers={buffers} duration={duration}/>}
              <CurrentBar progress={progress} ended={ended}/>
            </div>
          </div>
          <div className={style.barButtons}>
            <Play playButtonClick={playButtonClick} ended={ended} isPlaying={isPlaying} id={id} className={visible}/>
            {duration !== undefined && !isNaN(duration) && <Timer isVisible={!isVisible} time={duration - currentTime}/>}
            <div className={barLeftClassname}>
              {duration && <div className={style.time}>
                {formatTimer(Math.round(currentTime))} / {formatTimer(duration)}
              </div>}
              <Volume refVolumeChanging={refVolumeChanging} withVideo={withVideo}/>
              <FullScreen playerRef={playerRef} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

type TimerProps = {
  time: number,
  isVisible: boolean,
}

export function Timer(props: TimerProps) {
  const className = classNames(style.timer, props.isVisible ? '' : style.hide)

  return <div className={className}>
    {formatTimer(props.time)}
  </div>
}