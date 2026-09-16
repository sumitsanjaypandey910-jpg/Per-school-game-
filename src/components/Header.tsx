import { Home, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  isFreePlay?: boolean;
  soundEnabled: boolean;
  onHomeClick: () => void;
  onPauseClick: () => void;
  onToggleSound: () => void;
}

export default function Header({
  currentQuestion,
  totalQuestions,
  score,
  isFreePlay = false,
  soundEnabled,
  onHomeClick,
  onPauseClick,
  onToggleSound,
}: HeaderProps) {
  return (
    <header className="w-full max-w-md mx-auto pt-3 px-4 flex flex-col items-center">
      {/* Top Bar: Home, Title, Action Controls */}
      <div className="w-full flex items-center justify-between">
        {/* Home Button (Warm golden yellow-orange with 3D button press) */}
        <button
          id="btn-home"
          type="button"
          onClick={onHomeClick}
          aria-label="Home"
          className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:translate-y-0.5 border-2 border-amber-300 shadow-[0_4px_0_#b45309] active:shadow-[0_1px_0_#b45309] flex items-center justify-center text-white transition-all cursor-pointer"
        >
          <Home className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Center Title */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Ten Frame
          </h1>
        </div>

        {/* Right Controls: Sound + Pause */}
        <div className="flex items-center gap-2">
          <button
            id="btn-sound"
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            className="w-10 h-10 rounded-full bg-blue-500/80 hover:bg-blue-400/90 active:translate-y-0.5 border border-blue-300/40 shadow-sm flex items-center justify-center text-white transition-all cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5 text-red-200" />
            )}
          </button>

          <button
            id="btn-pause"
            type="button"
            onClick={onPauseClick}
            aria-label="Pause"
            className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:translate-y-0.5 border-2 border-amber-300 shadow-[0_4px_0_#b45309] active:shadow-[0_1px_0_#b45309] flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <Pause className="w-6 h-6 fill-white stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Level / Progress Indicator (Exactly like screenshot: 2 / 10) */}
      <div className="mt-3 flex items-center justify-center gap-3">
        {!isFreePlay ? (
          <div className="px-4 py-1 rounded-full bg-blue-900/40 border border-blue-400/30 text-white font-bold text-lg sm:text-xl tracking-wider shadow-inner flex items-center gap-2">
            <span>{currentQuestion} / {totalQuestions}</span>
            {score > 0 && (
              <span className="text-xs bg-amber-400 text-blue-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 fill-blue-950" /> {score}
              </span>
            )}
          </div>
        ) : (
          <div className="px-4 py-1 rounded-full bg-amber-400 text-blue-950 font-bold text-sm tracking-wider shadow-md">
            Free Play Sandbox
          </div>
        )}
      </div>
    </header>
  );
}
