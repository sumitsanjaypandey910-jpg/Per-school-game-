import { Play, RotateCcw, LayoutGrid, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PauseModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onSelectMode: () => void;
  onToggleSound: () => void;
}

export default function PauseModal({
  isOpen,
  soundEnabled,
  onResume,
  onRestart,
  onSelectMode,
  onToggleSound,
}: PauseModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/70 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 border-4 border-amber-400 shadow-2xl flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-600 mb-2">
              <Play className="w-8 h-8 fill-amber-500 stroke-amber-600 translate-x-0.5" />
            </div>

            <h2 className="text-2xl font-bold text-blue-950 mb-1">Game Paused</h2>
            <p className="text-sm text-slate-500 mb-6">Take a quick breather!</p>

            <div className="w-full flex flex-col gap-3">
              {/* Resume Button */}
              <button
                id="btn-modal-resume"
                type="button"
                onClick={onResume}
                className="w-full py-3.5 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-lg border-2 border-blue-600 shadow-[0_4px_0_#1e3a8a] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Play className="w-5 h-5 fill-white stroke-none" />
                <span>Resume Game</span>
              </button>

              {/* Restart Button */}
              <button
                id="btn-modal-restart"
                type="button"
                onClick={onRestart}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0.5"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
                <span>Restart Round</span>
              </button>

              {/* Sound Toggle */}
              <button
                id="btn-modal-sound"
                type="button"
                onClick={onToggleSound}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0.5"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>Sound: ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-red-500" />
                    <span>Sound: OFF</span>
                  </>
                )}
              </button>

              {/* Change Game Mode */}
              <button
                id="btn-modal-modes"
                type="button"
                onClick={onSelectMode}
                className="w-full py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0.5"
              >
                <LayoutGrid className="w-4 h-4 text-amber-600" />
                <span>Change Mode</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
