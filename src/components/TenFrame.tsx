import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CounterItem, GameMode, PrimaryColor } from '../types';
import { playPop } from '../utils/audio';

interface TenFrameProps {
  counters: (CounterItem | null)[];
  mode: GameMode;
  selectedColor?: PrimaryColor;
  onCellClick?: (index: number) => void;
  interactiveCounting?: boolean;
}

export default function TenFrame({
  counters,
  mode,
  selectedColor = 'blue',
  onCellClick,
  interactiveCounting = true,
}: TenFrameProps) {
  // Store which counters have been counted in "count" mode
  const [countedIndices, setCountedIndices] = useState<Map<number, number>>(new Map());

  // Reset counted map when counters change
  useEffect(() => {
    setCountedIndices(new Map());
  }, [counters]);

  const handleCellClick = (index: number) => {
    const item = counters[index];

    if (mode === 'count' && interactiveCounting) {
      if (item) {
        setCountedIndices((prev) => {
          const next = new Map(prev);
          if (next.has(index)) {
            next.delete(index);
          } else {
            const nextCount = next.size + 1;
            next.set(index, nextCount);
            playPop(nextCount);
          }
          return next;
        });
      }
      return;
    }

    if (onCellClick) {
      onCellClick(index);
    }
  };

  const getColorClasses = (color: PrimaryColor) => {
    switch (color) {
      case 'red':
        return {
          token: 'bg-gradient-to-b from-red-500 to-red-600 border-2 border-red-700 shadow-[0_3px_0_#991b1b,inset_0_2px_4px_rgba(255,255,255,0.4)]',
          ring: 'ring-red-400',
        };
      case 'yellow':
        return {
          token: 'bg-gradient-to-b from-amber-300 to-amber-400 border-2 border-amber-500 shadow-[0_3px_0_#b45309,inset_0_2px_4px_rgba(255,255,255,0.6)]',
          ring: 'ring-amber-300',
        };
      case 'blue':
      default:
        return {
          token: 'bg-gradient-to-b from-blue-500 to-blue-600 border-2 border-blue-700 shadow-[0_3px_0_#1e3a8a,inset_0_2px_4px_rgba(255,255,255,0.4)]',
          ring: 'ring-blue-400',
        };
    }
  };

  return (
    <div className="w-full max-w-[390px] sm:max-w-[420px] mx-auto px-4 my-auto flex flex-col items-center">
      {/* Notebook Pad Container with Layered Sheets */}
      <div className="relative w-full">
        {/* Layered Paper Shadows (bottom and right sheets for realistic notepad) */}
        <div className="absolute inset-0 translate-x-2 translate-y-2 bg-slate-200/90 rounded-2xl border border-slate-300/80 shadow-md" />
        <div className="absolute inset-0 translate-x-1 translate-y-1 bg-slate-100/95 rounded-2xl border border-slate-200/90 shadow-sm" />

        {/* Topmost Notepad Page */}
        <div className="relative bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xl overflow-hidden">
          {/* Subtle Graph Paper Pattern Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: `
                linear-gradient(to right, #0284c7 1px, transparent 1px),
                linear-gradient(to bottom, #0284c7 1px, transparent 1px)
              `,
              backgroundSize: '16px 16px',
            }}
          />

          {/* Notebook Spiral / Top Margin accent */}
          <div className="relative w-full flex justify-between items-center mb-3 sm:mb-4 px-2">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-300/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-300/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-300/60" />
            </div>
            <span className="text-xs font-semibold text-blue-900/50 uppercase tracking-wider">
              {mode === 'count'
                ? 'Tap dots to count'
                : mode === 'build'
                ? 'Fill the boxes'
                : mode === 'make10'
                ? 'Make 10 with Red'
                : 'Ten Frame Grid'}
            </span>
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-300/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-300/60" />
            </div>
          </div>

          {/* The Ten Frame (2 rows x 5 columns) matching the screenshot */}
          <div
            id="ten-frame-grid"
            className="relative w-full bg-white/95 rounded-lg border-2 border-[#0F4C81] shadow-sm overflow-hidden"
          >
            {/* Top Row (5 cells) */}
            <div className="grid grid-cols-5 border-b-2 border-[#0F4C81]">
              {[0, 1, 2, 3, 4].map((index) => renderCell(index))}
            </div>

            {/* Bottom Row (5 cells) */}
            <div className="grid grid-cols-5">
              {[5, 6, 7, 8, 9].map((index) => renderCell(index))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function renderCell(index: number) {
    const counter = counters[index];
    const countedNumber = countedIndices.get(index);
    const isRightEdge = index % 5 === 4;

    return (
      <button
        key={`cell-${index}`}
        id={`ten-frame-cell-${index}`}
        type="button"
        onClick={() => handleCellClick(index)}
        aria-label={`Cell ${index + 1}, ${counter ? `${counter.color} counter` : 'empty'}`}
        className={`aspect-square relative flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          !isRightEdge ? 'border-r-2 border-[#0F4C81]' : ''
        } ${mode !== 'count' ? 'hover:bg-blue-50/50 active:bg-blue-100/60 cursor-pointer' : 'cursor-default'}`}
      >
        {/* Subtle hover indicator for build/sandbox mode */}
        {mode !== 'count' && !counter && (
          <div className="w-8 h-8 rounded-full border border-dashed border-slate-300/70 opacity-0 hover:opacity-100 transition-opacity" />
        )}

        {/* Counter Token */}
        <AnimatePresence>
          {counter && (
            <motion.div
              key={`token-${counter.id}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className={`w-[74%] h-[74%] max-w-[50px] max-h-[50px] rounded-full flex items-center justify-center cursor-pointer select-none relative ${
                getColorClasses(counter.color).token
              }`}
            >
              {/* Tap-to-count feedback badge */}
              {countedNumber && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="font-bold text-white text-base sm:text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                >
                  {countedNumber}
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );
  }
}
