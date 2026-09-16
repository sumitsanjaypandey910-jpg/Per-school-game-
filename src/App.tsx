import { useState, useEffect, useCallback } from 'react';
import { GameMode, CounterItem, PrimaryColor, GameStats } from './types';
import Header from './components/Header';
import TenFrame from './components/TenFrame';
import NumberPad from './components/NumberPad';
import BuildControls from './components/BuildControls';
import ModeSelector from './components/ModeSelector';
import PauseModal from './components/PauseModal';
import VictoryModal from './components/VictoryModal';
import { playSuccess, playTryAgain, setSoundEnabled, isSoundEnabled } from './utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Check, HelpCircle } from 'lucide-react';

const TOTAL_QUESTIONS = 10;

export default function App() {
  const [mode, setMode] = useState<GameMode>('count');
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundActive, setSoundActive] = useState(isSoundEnabled());
  const [selectedColor, setSelectedColor] = useState<PrimaryColor>('blue');

  // Stats
  const [stats, setStats] = useState<GameStats>({
    currentQuestionIndex: 0, // 0-based -> displays as 1 to 10 (or start with 1 so 2/10 matches screenshot!)
    totalQuestions: TOTAL_QUESTIONS,
    score: 0,
    streak: 0,
    bestScore: 0,
  });

  // Ten frame state: 10 cells (indices 0 to 9)
  const [counters, setCounters] = useState<(CounterItem | null)[]>(() => Array(10).fill(null));
  const [targetNumber, setTargetNumber] = useState<number>(9); // default 9 (matching screenshot 2/10 with 9 dots!)
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [wrongSelection, setWrongSelection] = useState<number | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isVictory, setIsVictory] = useState(false);

  // Helper to generate a standardized ten-frame filling (top row 0-4, then bottom row 5-9)
  const generateFilledFrame = useCallback((count: number, primary: PrimaryColor = 'blue', secondary?: { count: number; color: PrimaryColor }) => {
    const cells: (CounterItem | null)[] = Array(10).fill(null);
    let idCounter = 1;

    if (secondary) {
      // First place primary count, then secondary count
      for (let i = 0; i < count && i < 10; i++) {
        cells[i] = { color: primary, id: `c-${idCounter++}` };
      }
      for (let i = count; i < count + secondary.count && i < 10; i++) {
        cells[i] = { color: secondary.color, id: `c-${idCounter++}` };
      }
    } else {
      for (let i = 0; i < count && i < 10; i++) {
        cells[i] = { color: primary, id: `c-${idCounter++}` };
      }
    }
    return cells;
  }, []);

  // Initialize a new question based on current mode and question index
  const startQuestion = useCallback((qIndex: number, currentMode: GameMode) => {
    setFeedback(null);
    setWrongSelection(null);
    setSelectedNumber(null);

    if (currentMode === 'count') {
      // Pick a random target between 1 and 10
      // If question 1 (display 2/10), default to 9 dots matching screenshot!
      const target = qIndex === 1 ? 9 : Math.floor(Math.random() * 10) + 1;
      setTargetNumber(target);
      // Alternate primary colors for variety, default blue
      const colors: PrimaryColor[] = ['blue', 'red', 'yellow'];
      const chosenColor = colors[qIndex % colors.length];
      setCounters(generateFilledFrame(target, chosenColor));
    } else if (currentMode === 'build') {
      const target = Math.floor(Math.random() * 10) + 1;
      setTargetNumber(target);
      setCounters(Array(10).fill(null));
    } else if (currentMode === 'make10') {
      // e.g. 6 Blue counters, needs 4 Red to make 10
      const baseBlue = Math.floor(Math.random() * 9) + 1; // 1 to 9
      setTargetNumber(10 - baseBlue); // Missing number to find!
      setCounters(generateFilledFrame(baseBlue, 'blue'));
    } else if (currentMode === 'freeplay') {
      setCounters(Array(10).fill(null));
    }
  }, [generateFilledFrame]);

  // Start new round
  const restartRound = useCallback((newMode?: GameMode) => {
    const activeMode = newMode || mode;
    setIsVictory(false);
    setIsPaused(false);
    // Let question index start at 1 (displays as "2 / 10" just like screenshot) or 0
    // Starting at index 1 lets users immediately see the exact "2 / 10" with 9 dots from the prompt!
    const startingIndex = activeMode === 'count' ? 1 : 0;
    setStats((prev) => ({
      ...prev,
      currentQuestionIndex: startingIndex,
      score: startingIndex === 1 ? 1 : 0, // already got 1/10 right if starting on 2/10
    }));
    startQuestion(startingIndex, activeMode);
  }, [mode, startQuestion]);

  // Initial load
  useEffect(() => {
    // Start on "2 / 10" with 9 blue dots to mirror the screenshot exactly!
    setStats((prev) => ({
      ...prev,
      currentQuestionIndex: 1, // question 2 of 10
      score: 1,
    }));
    setTargetNumber(9);
    setCounters(generateFilledFrame(9, 'blue'));
  }, [generateFilledFrame]);

  // Cell click handler (Build and Free Play and Make 10)
  const handleCellClick = (index: number) => {
    if (mode === 'count') return; // In count mode, clicking cells triggers counting sound and numbers

    if (mode === 'make10') {
      // In make10 mode, the blue counters are fixed. Tapping an empty cell places a Red counter!
      const current = counters[index];
      if (current && current.color === 'blue') return; // fixed prompt counter

      setCounters((prev) => {
        const next = [...prev];
        if (next[index]) {
          next[index] = null;
        } else {
          next[index] = { color: 'red', id: `c-${Date.now()}-${index}` };
        }
        return next;
      });
      return;
    }

    // Build or Freeplay: toggle cell with selected primary color
    setCounters((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = null;
      } else {
        next[index] = { color: selectedColor, id: `c-${Date.now()}-${index}` };
      }
      return next;
    });
  };

  // Answer handler for Count & Make 10
  const handleNumberSelect = (num: number) => {
    if (feedback?.isCorrect) return;

    const isCorrect = num === targetNumber;

    if (isCorrect) {
      playSuccess();
      setSelectedNumber(num);
      setFeedback({
        isCorrect: true,
        message: mode === 'make10' ? `Correct! ${10 - targetNumber} + ${targetNumber} = 10!` : `Awesome! That's ${num}!`,
      });

      const nextScore = stats.score + 1;
      const nextQ = stats.currentQuestionIndex + 1;

      setTimeout(() => {
        if (nextQ >= TOTAL_QUESTIONS) {
          setStats((prev) => ({ ...prev, score: nextScore }));
          setIsVictory(true);
        } else {
          setStats((prev) => ({
            ...prev,
            currentQuestionIndex: nextQ,
            score: nextScore,
          }));
          startQuestion(nextQ, mode);
        }
      }, 1200);
    } else {
      playTryAgain();
      setWrongSelection(num);
      setFeedback({
        isCorrect: false,
        message: mode === 'make10' ? 'Not quite, count the empty spaces!' : 'Try again! Tap the dots to count.',
      });
      setTimeout(() => {
        setWrongSelection(null);
      }, 700);
    }
  };

  // Check handler for Build Mode
  const handleCheckBuild = () => {
    const count = counters.filter(Boolean).length;
    if (count === targetNumber) {
      playSuccess();
      setFeedback({
        isCorrect: true,
        message: `Great job! You made ${targetNumber}!`,
      });

      const nextScore = stats.score + 1;
      const nextQ = stats.currentQuestionIndex + 1;

      setTimeout(() => {
        if (nextQ >= TOTAL_QUESTIONS) {
          setStats((prev) => ({ ...prev, score: nextScore }));
          setIsVictory(true);
        } else {
          setStats((prev) => ({
            ...prev,
            currentQuestionIndex: nextQ,
            score: nextScore,
          }));
          startQuestion(nextQ, mode);
        }
      }, 1200);
    } else {
      playTryAgain();
      const diff = targetNumber - count;
      setFeedback({
        isCorrect: false,
        message: diff > 0 ? `You have ${count}. Add ${diff} more!` : `You have ${count}. Remove ${Math.abs(diff)}!`,
      });
    }
  };

  const handleClearFrame = () => {
    if (mode === 'make10') {
      // Clear only red user counters
      setCounters((prev) =>
        prev.map((c) => (c && c.color === 'blue' ? c : null))
      );
    } else {
      setCounters(Array(10).fill(null));
    }
  };

  const handleFillAll = () => {
    setCounters(
      Array(10)
        .fill(null)
        .map((_, i) => ({ color: selectedColor, id: `fill-${i}-${Date.now()}` }))
    );
  };

  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
  };

  // Primary color counters breakdown for Free Play / Math breakdown
  const blueCount = counters.filter((c) => c?.color === 'blue').length;
  const redCount = counters.filter((c) => c?.color === 'red').length;
  const yellowCount = counters.filter((c) => c?.color === 'yellow').length;
  const totalCount = counters.filter(Boolean).length;

  return (
    <div className="min-h-screen w-full bg-[#1565C0] flex flex-col justify-between relative overflow-x-hidden font-['Fredoka',sans-serif]">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header Bar */}
      <Header
        currentQuestion={stats.currentQuestionIndex + 1}
        totalQuestions={stats.totalQuestions}
        score={stats.score}
        isFreePlay={mode === 'freeplay'}
        soundEnabled={soundActive}
        onHomeClick={() => setShowModeSelector(true)}
        onPauseClick={() => setIsPaused(true)}
        onToggleSound={toggleSound}
      />

      {/* Main Interactive Play Area */}
      <main className="w-full flex-1 flex flex-col justify-center items-center py-2 sm:py-4 z-10">
        {/* Feedback Banner */}
        <div className="h-9 mb-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                key={feedback.message}
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className={`px-4 py-1.5 rounded-full font-bold text-sm sm:text-base flex items-center gap-1.5 shadow-md ${
                  feedback.isCorrect
                    ? 'bg-emerald-400 text-emerald-950 border border-emerald-300'
                    : 'bg-amber-300 text-amber-950 border border-amber-200'
                }`}
              >
                {feedback.isCorrect ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <HelpCircle className="w-4 h-4" />
                )}
                <span>{feedback.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ten Frame Notepad Component */}
        <TenFrame
          counters={counters}
          mode={mode}
          selectedColor={selectedColor}
          onCellClick={handleCellClick}
          interactiveCounting={mode === 'count'}
        />

        {/* Math equation bar for Free Play */}
        {mode === 'freeplay' && (
          <div className="mt-3 px-4 py-1.5 rounded-2xl bg-blue-900/80 border border-blue-300/40 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-inner">
            <span className="flex items-center gap-1 text-blue-300">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> {blueCount}
            </span>
            <span>+</span>
            <span className="flex items-center gap-1 text-red-300">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> {redCount}
            </span>
            <span>+</span>
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> {yellowCount}
            </span>
            <span>=</span>
            <span className="text-amber-300 font-extrabold text-lg">{totalCount} / 10</span>
          </div>
        )}
      </main>

      {/* Footer Controls based on Mode */}
      <footer className="w-full pb-3 z-10">
        {mode === 'count' && (
          <NumberPad
            promptText="How many counters?"
            onSelectNumber={handleNumberSelect}
            selectedNumber={selectedNumber}
            wrongNumber={wrongSelection}
            disabled={feedback?.isCorrect}
          />
        )}

        {mode === 'make10' && (
          <NumberPad
            promptText={`How many more to make 10? (${10 - targetNumber} + ? = 10)`}
            onSelectNumber={handleNumberSelect}
            selectedNumber={selectedNumber}
            wrongNumber={wrongSelection}
            disabled={feedback?.isCorrect}
          />
        )}

        {mode === 'build' && (
          <BuildControls
            currentCount={counters.filter(Boolean).length}
            targetCount={targetNumber}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            onClear={handleClearFrame}
            onCheckAnswer={handleCheckBuild}
          />
        )}

        {mode === 'freeplay' && (
          <BuildControls
            isFreePlay
            currentCount={totalCount}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            onClear={handleClearFrame}
            onFillAll={handleFillAll}
          />
        )}
      </footer>

      {/* Mode Selector Overlay */}
      {showModeSelector && (
        <ModeSelector
          currentMode={mode}
          onSelectMode={(newMode) => {
            setMode(newMode);
            setShowModeSelector(false);
            restartRound(newMode);
          }}
          onClose={() => setShowModeSelector(false)}
        />
      )}

      {/* Pause Menu Modal */}
      <PauseModal
        isOpen={isPaused}
        soundEnabled={soundActive}
        onResume={() => setIsPaused(false)}
        onRestart={() => restartRound()}
        onSelectMode={() => {
          setIsPaused(false);
          setShowModeSelector(true);
        }}
        onToggleSound={toggleSound}
      />

      {/* Victory / Round Complete Modal */}
      <VictoryModal
        isOpen={isVictory}
        score={stats.score}
        totalQuestions={stats.totalQuestions}
        onPlayAgain={() => restartRound()}
        onHome={() => {
          setIsVictory(false);
          setShowModeSelector(true);
        }}
      />
    </div>
  );
}
