import IconS from './Icon.module.css'
import classNames from "classnames";
// import {ORIGIN} from "../../../next.config.ts";

type Props = {
  class?: string
  // size?: 'S' | 'M' | 'L'
  name: string
}

export function Icon (props: Props) {
  const classes = classNames(props.class, IconS.icon)

  const style = {
    maskImage: `url(/svg/${props.name}.svg)`
  }
  return (
    <span className={classes} style={style}></span>
  )
}