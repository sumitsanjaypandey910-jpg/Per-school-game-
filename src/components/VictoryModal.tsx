import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, RotateCcw, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playFanfare } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

export default function VictoryModal({
  isOpen,
  score,
  totalQuestions,
  onPlayAgain,
  onHome,
}: VictoryModalProps) {
  useEffect(() => {
    if (isOpen) {
      playFanfare();
      // Throw festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#DC2626', '#F59E0B'], // Primary colors!
      });
    }
  }, [isOpen]);

  const starCount = score === totalQuestions ? 3 : score >= 7 ? 2 : 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/75 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 border-4 border-amber-400 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Top Stars Award */}
            <div className="flex items-center justify-center gap-2 mb-3 mt-1">
              {[1, 2, 3].map((starIdx) => {
                const isEarned = starIdx <= starCount;
                return (
                  <motion.div
                    key={`star-${starIdx}`}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + starIdx * 0.15, type: 'spring' }}
                  >
                    <Star
                      className={`w-12 h-12 ${
                        isEarned
                          ? 'fill-amber-400 text-amber-500 drop-shadow-[0_4px_6px_rgba(245,158,11,0.4)]'
                          : 'fill-slate-200 text-slate-300'
                      }`}
                    />
                  </motion.div>
                );
              })}
            </div>

            <h2 className="text-3xl font-black text-blue-950 mb-1">
              {score === totalQuestions ? 'Brilliant!' : score >= 7 ? 'Awesome Job!' : 'Good Effort!'}
            </h2>
            <p className="text-slate-600 font-medium mb-4">You completed the round!</p>

            {/* Score Pill in Primary Colors */}
            <div className="w-full bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl p-4 border border-amber-200 mb-6 flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Score</span>
              <span className="text-4xl font-black text-blue-900 mt-0.5">
                {score} <span className="text-2xl font-bold text-slate-400">/ {totalQuestions}</span>
              </span>
            </div>

            {/* Buttons */}
            <div className="w-full flex flex-col gap-3">
              <button
                id="btn-victory-play-again"
                type="button"
                onClick={onPlayAgain}
                className="w-full py-3.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 font-black text-lg border-2 border-amber-300 shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-5 h-5 text-blue-950" />
                <span>Play Again</span>
              </button>

              <button
                id="btn-victory-home"
                type="button"
                onClick={onHome}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0.5"
              >
                <Home className="w-4 h-4 text-slate-600" />
                <span>Choose Game Mode</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
