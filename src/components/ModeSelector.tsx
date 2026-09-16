import { motion } from 'motion/react';
import { GameMode } from '../types';
import { Sparkles, Hash, PlusCircle, Wrench, Play } from 'lucide-react';
import { playClick } from '../utils/audio';

interface ModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onClose?: () => void;
}

export default function ModeSelector({
  onSelectMode,
  onClose,
}: ModeSelectorProps) {
  const modes: {
    id: GameMode;
    title: string;
    description: string;
    icon: typeof Hash;
    accentBg: string;
    borderColor: string;
    previewDots: { color: string }[];
  }[] = [
    {
      id: 'count',
      title: 'Count & Match',
      description: 'Count the primary dots in the frame & pick the number',
      icon: Hash,
      accentBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      borderColor: 'border-blue-400',
      previewDots: [
        { color: 'bg-blue-500' },
        { color: 'bg-blue-500' },
        { color: 'bg-blue-500' },
      ],
    },
    {
      id: 'build',
      title: 'Build the Number',
      description: 'Place primary red, blue, or yellow tokens in the frame',
      icon: PlusCircle,
      accentBg: 'bg-gradient-to-br from-red-500 to-red-600',
      borderColor: 'border-red-400',
      previewDots: [
        { color: 'bg-red-500' },
        { color: 'bg-yellow-400' },
        { color: 'bg-blue-500' },
      ],
    },
    {
      id: 'make10',
      title: 'Make 10!',
      description: 'How many more counters are needed to fill the frame?',
      icon: Sparkles,
      accentBg: 'bg-gradient-to-br from-amber-400 to-amber-500',
      borderColor: 'border-amber-300',
      previewDots: [
        { color: 'bg-blue-500' },
        { color: 'bg-blue-500' },
        { color: 'bg-red-500' },
      ],
    },
    {
      id: 'freeplay',
      title: 'Free Play Sandbox',
      description: 'Place, count & experiment with all primary colours freely',
      icon: Wrench,
      accentBg: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      borderColor: 'border-indigo-400',
      previewDots: [
        { color: 'bg-yellow-400' },
        { color: 'bg-red-500' },
        { color: 'bg-blue-500' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 border-4 border-amber-400 shadow-2xl flex flex-col items-center"
      >
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl sm:text-3xl font-black text-blue-950">Select Game Mode</h2>
        </div>
        <p className="text-sm text-slate-500 mb-5 text-center">
          Learn math with primary-colored ten frames!
        </p>

        <div className="w-full flex flex-col gap-3">
          {modes.map((m) => {
            const IconComponent = m.icon;
            return (
              <button
                key={m.id}
                id={`btn-select-mode-${m.id}`}
                type="button"
                onClick={() => {
                  playClick();
                  onSelectMode(m.id);
                }}
                className="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 transition-all flex items-center justify-between group cursor-pointer shadow-xs active:translate-y-0.5"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl ${m.accentBg} text-white flex items-center justify-center shadow-md shrink-0`}
                  >
                    <IconComponent className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-base group-hover:text-blue-900 transition-colors">
                      {m.title}
                    </div>
                    <div className="text-xs text-slate-500 leading-snug line-clamp-1">
                      {m.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pl-2 shrink-0">
                  {m.previewDots.map((dot, idx) => (
                    <span
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full ${dot.color} border border-white shadow-xs inline-block`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {onClose && (
          <button
            id="btn-close-modes"
            type="button"
            onClick={onClose}
            className="mt-5 text-sm font-bold text-blue-800 hover:text-blue-950 underline cursor-pointer"
          >
            Back to Game
          </button>
        )}
      </motion.div>
    </div>
  );
}
