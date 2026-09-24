import { motion, AnimatePresence } from 'framer-motion';

export default function Loading({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-overlay"
          className="recipe-loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          aria-live="polite"
          role="status"
        >
          <div className="recipe-loading-content">
            <div className="recipe-loading-spinner">
              <span />
              <span />
              <span />
            </div>
            <h2 className="recipe-loading-title">Creating your recipe…</h2>
            <p className="recipe-loading-sub">
              Gemini is turning your ingredients into a practical cooking plan.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
