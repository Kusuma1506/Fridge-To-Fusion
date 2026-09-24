import { useEffect, useRef, useState } from 'react';

export default function VideoBanner() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShouldLoad(true); observer.disconnect(); }
    }, { rootMargin: '180px' });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  return <aside ref={containerRef} className="video-banner" aria-label="Food preparation showcase">
    {shouldLoad && <video ref={videoRef} src="/assets/kitchen-loop.mp4" autoPlay muted loop playsInline preload="metadata" onCanPlay={() => { videoRef.current.playbackRate = 2; }} />}
    <div className="video-overlay"><span>Fresh ideas, faster</span><strong>2× kitchen inspiration</strong></div>
  </aside>;
}
