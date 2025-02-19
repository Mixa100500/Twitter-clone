import classNames from "classnames";
import {useState} from "react";

type ImageProps = {
  src?: string,
  alt: string,
  sizes?: string,
  srcSet?: string,
  loading?: "eager" | "lazy",
  class: string,
}

export function Image (props: ImageProps) {
  const { src, alt, srcSet, loading, sizes } = props

  const [loaded, setLoaded] = useState(false)
  const className = classNames(
    props.class,
    !loaded && 'placeholder'
  )

  if(!src) {
    return <div className={className}>

    </div>
  }
  return <img
    className={className}
    src={src}
    alt={alt}
    srcSet={srcSet}
    sizes={sizes}
    loading={loading}
    onLoad={() => setLoaded(true)}
  />
}