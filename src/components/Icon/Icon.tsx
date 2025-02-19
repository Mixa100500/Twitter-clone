import IconS from './Icon.module.css'
import classNames from "classnames";
// import {ORIGIN} from "../../../next.config.ts";

type Props = {
  class?: string
  // size?: 'S' | 'M' | 'L'
  name: string
}

const oldMaskImage = 'WebkitMaskImage'

export function Icon (props: Props) {
  const classes = classNames(props.class, IconS.icon)
  const value = `url(/svg/${props.name}.svg)`

  const style = {
    [oldMaskImage]: value,
    maskImage: value,
  }

  return (
    <span className={classes} style={style}></span>
  )
}