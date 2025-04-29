import style from "@/feature/player/components/ControlBar/ControlBar.module.css";

type PropsBar = {
  progress: number,
  ended: boolean | undefined
}

export function CurrentBar({ progress, ended }: PropsBar) {
  const width = ended ? '100%' : progress + '%'
  return (
    <>
      <div className={style.barCurrent} style={{
        width,
      }}>
      </div>
      <div className={style.circleMover} style={{
        width,
      }}>
        <div className={style.circleContainer}>
          <div className={style.circle}></div>
        </div>
      </div>
    </>
  )
}