import { useRef, useState } from "react";
import { Play } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { SocialLinks } from "../components/Footer.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { COMPANY, GALLERY_VIDEOS } from "../data/catalog.js";

// Only metadata loads until a video is played, so the page stays light
function VideoTile({ src, index }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const play = () => { ref.current?.play(); };

  return (
    <div className={`video-tile ${playing ? "is-playing" : ""}`}>
      <video ref={ref} src={`${src}#t=0.5`} preload="metadata" playsInline controls={playing} onPlay={() => setPlaying(true)} aria-label={`Rajani Jewels video ${index + 1}`} />
      {!playing && <button className="video-play" onClick={play} aria-label={`Play video ${index + 1}`}><Play size={22} fill="currentColor" /></button>}
    </div>
  );
}

export default function Gallery() {
  useTitle("Gallery");
  return (
    <>
      <PageHeader title="Gallery" sub="Jewellery is a reflection of your style, emotions and memories. See our designs in motion." crumbs={[{ label: "Gallery" }]} />
      <div className="section-container">
        <div className="video-grid">
          {GALLERY_VIDEOS.map((src, i) => (
            <Reveal key={src} delay={(i % 4) * 0.05}><VideoTile src={src} index={i} /></Reveal>
          ))}
        </div>
        <div className="gallery-follow">
          <p>More designs every week on our channels</p>
          <SocialLinks />
          <a className="text-link" href={COMPANY.video} target="_blank" rel="noreferrer">Watch on YouTube</a>
        </div>
      </div>
    </>
  );
}
