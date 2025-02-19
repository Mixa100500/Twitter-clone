import {Variants} from "@/feature/tweets/types.ts";
import classNames from "classnames";
import {useState} from "react";
// import style from './Player.module.css'

type Props = {
  class: string,
  variants?: Variants
}

export function Player (props: Props) {
  const { variants } = props;
  const [startLoad, setStartLoad] = useState(false)
  const className = classNames(props.class, {'placeholder': !startLoad})

  if(!variants) {
    return <div className={className}></div>
  }

  return <video
    autoPlay
    loop
    muted
    playsInline
    controls
    className={className}
    onLoadStart={() => setStartLoad(true)}
  >
    {variants.reverse().map(variant => (
      <source key={variant.url} src={variant.url} type={variant.content_type}/>)
    )}

    Your Browser do not support this video
  </video>
}