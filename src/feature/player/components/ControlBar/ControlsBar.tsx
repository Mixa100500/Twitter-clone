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

type PropsControlBar = {
  id: string
  withVideo: boolean
  isVisible: boolean
  isPlaying: boolean
  playerRef: HTMLDivElement | null
  ended: boolean | undefined
  playButtonClick: (e: MouseEvent) => void
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

export function ControlBar ({ id, withVideo, isVisible, isPlaying, playerRef, ended, playButtonClick }: PropsControlBar) {
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
  const visible = isVisible ? '' : style.hide;
  const visibleContainer = classNames(isVisible ? '' : style.hide, style.hideContainer);

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
    console.log('mouseUp')
    e.preventDefault();
    setTimeLineActive(false);
    stopCheckUseEffect.current = false;
  }

  function timeLineClick(e: MouseEvent) {
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

  function mouseLeave(e: MouseEvent) {
    e.preventDefault();
    setTimeLineActive(false);
    stopCheckUseEffect.current = false;
  }

  function onmousemove(e: MouseEvent) {
    e.preventDefault();
    if(!withVideo) {
      return;
    }

    if(refTimeline.current && stopCheckUseEffect.current) {
      const rect = refTimeline.current.getBoundingClientRect();
      let pos = (e.clientX - rect.left) / rect.width;
      pos = Math.max(0, Math.min(1, pos));
      const video = getVideo();

      if(duration && video) {
        const currentTime = duration * pos
        const newPosition = currentTime / duration * 100
        video.currentTime = currentTime;
        setCurrentTime(currentTime)
        setProgress(newPosition)
      }
    }
  }
  
  function onmousedown(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setTimeLineActive(true);
    stopCheckUseEffect.current = true;
  }

  const timeLineClassName = classNames(style.timeLine, timeLineActive && style.timeLineActive)
  const barLeftClassname = classNames(style.barRight, !isVisible && style.hide)
  return (
    <>
      <div className={style.mouseLeaveTarget} onPointerMove={onmousemove} onPointerUp={mouseUp} onPointerLeave={mouseLeave}>
        <div className={style.mouseTargetPlay} onClick={playButtonClick}></div>
        <div className={style.bar}>
          <div className={timeLineClassName} ref={refTimeline} onPointerDown={onmousedown} onClick={timeLineClick}>
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
              <Volume withVideo={withVideo}/>
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