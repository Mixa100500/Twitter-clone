import {BufferRanges} from "@/feature/player/store.ts";
import style from "@/feature/player/components/ControlBar/ControlBar.module.css";

type PropsBuffer = {
  buffers: BufferRanges
  duration: number,
}

export function BufferBar({buffers, duration}: PropsBuffer) {

  return (
    <>
      {buffers.map((buffer, i) => (
        <div
          key={i}
          className={style.barBuffered}
          style={{
            left: `${(buffer.start / duration) * 100}%`,
            width: `${((buffer.end - buffer.start) / duration) * 100}%`
          }}
        />
      ))}
    </>
  )
}