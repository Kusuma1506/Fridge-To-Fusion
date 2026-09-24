import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SiteLoader — plays the intro video at 2x speed in a centered popup.
 * The site stays hidden (returns null for children) until video ends.
 */
export default function SiteLoader({ children }) {
  const [done, setDone] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (done) return;
    const video = videoRef.current;
    if (!video) return;

    const fallbackTimer = window.setTimeout(() => setDone(true), 4000);

    // Force 2x immediately
    video.playbackRate = 2.0;

    // Also set on every possible event to guarantee 2x
    const force2x = () => {
      video.playbackRate = 2.0;
      video.play().catch(() => {});
    };

    // Hide loader when video finishes
    const onEnded = () => {
      setDone(true);
    };

    const onError = () => {
      setDone(true);
    };

    video.addEventListener('loadedmetadata', force2x);
    video.addEventListener('canplay', force2x);
    video.addEventListener('playing', () => { video.playbackRate = 2.0; });
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);

    // Try playing right away in case metadata already loaded
    force2x();

    return () => {
      video.removeEventListener('loadedmetadata', force2x);
      video.removeEventListener('canplay', force2x);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
      window.clearTimeout(fallbackTimer);
    };
  }, [done]);

  return (
    <>
      <AnimatePresence>
        {!done && (
          <motion.div
            key="site-loader"
            className="site-loader-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="site-loader-popup"
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <video
                ref={videoRef}
                className="site-loader-video"
                src="/gemini_generated_video_ec5013d2.mp4"
                muted
                playsInline
                preload="auto"
              />
              <div className="site-loader-footer">
                <div className="site-loader-dots">
                  <span /><span /><span />
                </div>
                <span className="site-loader-label">Loading FridgeFusion…</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block the rest of the app until video is done */}
      {done && children}
    </>
  );
}
