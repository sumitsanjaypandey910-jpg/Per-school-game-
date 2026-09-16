import { motion } from 'motion/react';
import { playClick } from '../utils/audio';

interface NumberPadProps {
  onSelectNumber: (num: number) => void;
  disabled?: boolean;
  selectedNumber?: number | null;
  wrongNumber?: number | null;
  includeZero?: boolean;
  promptText?: string;
}

export default function NumberPad({
  onSelectNumber,
  disabled = false,
  selectedNumber = null,
  wrongNumber = null,
  includeZero = false,
  promptText = 'How many counters?',
}: NumberPadProps) {
  const numbers = includeZero
    ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleClick = (num: number) => {
    if (disabled) return;
    playClick();
    onSelectNumber(num);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-2 mb-4 flex flex-col items-center">
      {/* Prompt Label */}
      <div className="text-white text-lg font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] mb-2 flex items-center gap-2">
        <span>{promptText}</span>
      </div>

      {/* Primary-Colored Number Grid */}
      <div className="w-full grid grid-cols-5 gap-2 sm:gap-2.5">
        {numbers.map((num) => {
          const isSelected = selectedNumber === num;
          const isWrong = wrongNumber === num;

          // Alternate vibrant primary buttons or cohesive primary yellow tactile buttons
          return (
            <motion.button
              key={`num-${num}`}
              id={`btn-number-${num}`}
              type="button"
              disabled={disabled}
              whileTap={{ scale: 0.93 }}
              animate={isWrong ? { x: [-6, 6, -6, 6, 0] } : {}}
              transition={{ duration: 0.3 }}
              onClick={() => handleClick(num)}
              className={`h-12 sm:h-14 rounded-xl font-bold text-xl sm:text-2xl flex items-center justify-center transition-all cursor-pointer select-none ${
                isWrong
                  ? 'bg-red-500 text-white border-2 border-red-700 shadow-[0_4px_0_#991b1b]'
                  : isSelected
                  ? 'bg-emerald-400 text-emerald-950 border-2 border-emerald-500 shadow-[0_4px_0_#065f46]'
                  : 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-blue-950 border-2 border-amber-200 shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-[0_1px_0_#b45309]'
              } ${disabled ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {num}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
