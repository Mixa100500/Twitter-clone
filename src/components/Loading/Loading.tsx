import style from './Loading.module.css'
import classNames from "classnames";

type Props = {
  svgClass?: string
  containerClass?: string
}

export function Loading (props: Props) {
  const svg = classNames(style.svg, props.svgClass)
  const container = classNames(style.center, props.containerClass)

  return (
    <div className={container}>
      <svg className={svg} viewBox='0 0 32 32' width='100%' xmlns='http://www.w3.org/2000/svg'>
        <g>
          <circle className={style.topCircle} cx='16' cy='16' fill='none' r='14' strokeWidth='4'></circle>
        </g>
        <g className={style.animation}>
          <circle className={style.bottomCircle} cx='16' cy='16' fill='none' r='14' strokeWidth='4'></circle>
        </g>
      </svg>
    </div>
  )
}