import { Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import { PrimaryColor } from '../types';
import { playClick } from '../utils/audio';

interface BuildControlsProps {
  currentCount: number;
  targetCount?: number;
  selectedColor: PrimaryColor;
  onSelectColor: (color: PrimaryColor) => void;
  onClear: () => void;
  onFillAll?: () => void;
  onCheckAnswer?: () => void;
  isFreePlay?: boolean;
}

export default function BuildControls({
  currentCount,
  targetCount,
  selectedColor,
  onSelectColor,
  onClear,
  onFillAll,
  onCheckAnswer,
  isFreePlay = false,
}: BuildControlsProps) {
  const primaryColors: { id: PrimaryColor; name: string; bgClass: string; borderClass: string }[] = [
    {
      id: 'blue',
      name: 'Primary Blue',
      bgClass: 'bg-blue-600',
      borderClass: 'border-blue-400',
    },
    {
      id: 'red',
      name: 'Primary Red',
      bgClass: 'bg-red-600',
      borderClass: 'border-red-400',
    },
    {
      id: 'yellow',
      name: 'Primary Yellow',
      bgClass: 'bg-amber-400',
      borderClass: 'border-amber-200',
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-2 mb-3 flex flex-col items-center gap-3">
      {/* Target instructions (if in Build Mode) */}
      {!isFreePlay && typeof targetCount === 'number' && (
        <div className="w-full bg-blue-900/60 border border-blue-400/30 rounded-xl p-2.5 flex items-center justify-between text-white">
          <span className="font-bold text-base sm:text-lg">
            Make <span className="text-amber-300 underline font-black text-xl">{targetCount}</span> counters:
          </span>
          <span className="text-sm font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Placed: <b className={currentCount === targetCount ? 'text-emerald-300' : 'text-amber-300'}>{currentCount}</b> / {targetCount}
          </span>
        </div>
      )}

      {/* Primary Color Token Chooser */}
      <div className="flex items-center gap-3 bg-blue-950/40 p-2 rounded-2xl border border-blue-400/20">
        <span className="text-white text-xs font-semibold uppercase tracking-wider pl-1">
          Color:
        </span>
        <div className="flex items-center gap-2">
          {primaryColors.map((c) => {
            const isSelected = selectedColor === c.id;
            return (
              <button
                key={c.id}
                id={`btn-color-${c.id}`}
                type="button"
                onClick={() => {
                  playClick();
                  onSelectColor(c.id);
                }}
                className={`w-9 h-9 rounded-full ${c.bgClass} transition-all cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? 'ring-4 ring-white scale-110 shadow-lg'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title={c.name}
              >
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex items-center justify-center gap-3">
        <button
          id="btn-clear-frame"
          type="button"
          onClick={() => {
            playClick();
            onClear();
          }}
          className="flex-1 py-2.5 px-4 rounded-xl bg-blue-900/70 hover:bg-blue-800 text-white font-bold border border-blue-400/40 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0.5"
        >
          <Trash2 className="w-4 h-4 text-red-300" />
          <span>Clear</span>
        </button>

        {isFreePlay && onFillAll && (
          <button
            id="btn-fill-all"
            type="button"
            onClick={() => {
              playClick();
              onFillAll();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-900/70 hover:bg-blue-800 text-white font-bold border border-blue-400/40 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0.5"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span>Fill 10</span>
          </button>
        )}

        {!isFreePlay && onCheckAnswer && (
          <button
            id="btn-check-answer"
            type="button"
            onClick={onCheckAnswer}
            className="flex-1 py-2.5 px-5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 font-black border-2 border-amber-300 shadow-[0_3px_0_#b45309] flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0.5 active:shadow-[0_1px_0_#b45309]"
          >
            <CheckCircle2 className="w-5 h-5 text-blue-950" />
            <span>Done!</span>
          </button>
        )}
      </div>
    </div>
  );
}
