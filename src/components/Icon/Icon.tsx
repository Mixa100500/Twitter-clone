import IconS from './Icon.module.css'
import classNames from "classnames";
import {CSSProperties} from "react";

// Unique type for url prop which should get value only from
// svg import, about svg import type is written in global.d.ts
type SvgUrl = string & { __brand: 'svg' };

export interface MyCustomCSS extends CSSProperties {
  '--icon-url': number;
}

type Props = {
  class?: string
  url: SvgUrl
}

export function Icon (props: Props) {
  const classes = classNames(props.class, IconS.icon)
  const value = `url(${props.url})`

  return (
    <span className={classes} style={{'--icon-url': value} as unknown as MyCustomCSS}></span>
  )
}