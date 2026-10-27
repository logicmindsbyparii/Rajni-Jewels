import { useEffect, useRef, useState } from "react";

// Responsive, lazy image with a soft fade-in and a graceful fallback.
// `id` is an image path, or a catalogue image { src, thumb } — small slots get the thumbnail.
export default function SafeImage({
  id,
  alt,
  widths = [640, 1000, 1600],
  sizes = "100vw",
  position = "center",
  priority = false,
  className = "",
}) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const image = typeof id === "string" ? { src: id } : id || {};
  const small = Math.max(...widths) <= 480;
  const hasThumb = image.thumb && image.thumb !== image.src;

  useEffect(() => {
    setFailed(false);
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [image.src]);

  if (failed || !image.src) return <div className={`img-fallback ${className}`} role="img" aria-label={alt} />;

  return (
    <img
      ref={ref}
      className={`img ${loaded ? "is-loaded" : ""} ${className}`}
      src={small && hasThumb ? image.thumb : image.src}
      srcSet={!small && hasThumb ? `${image.thumb} 430w, ${image.src} 1400w` : undefined}
      sizes={!small && hasThumb ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      style={{ objectPosition: position }}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  );
}
