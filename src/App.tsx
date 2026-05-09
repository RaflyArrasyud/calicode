/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Dumbbell, 
  Terminal,
  Zap,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Data Types ---
interface WorkoutStep {
  name: string;
  duration: string;
  description: string;
}

interface Routine {
  title: string;
  focus: string;
  steps: WorkoutStep[];
}

// --- Constants & Data ---
const ROUTINES: Record<number, Routine> = {
  1: {
    title: "Quick Decompression",
    focus: "Mencegah Carpal Tunnel & Kekakuan Leher",
    steps: [
      { name: "Wrist Stretches", duration: "30s", description: "Peregangan pergelangan tangan ke depan dan belakang." },
      { name: "Neck Rotations", duration: "30s", description: "Putar leher perlahan untuk melepas ketegangan saraf." }
    ]
  },
  5: {
    title: "Arch Body Holds & Core",
    focus: "Postur & Stabilitas Core",
    steps: [
      { name: "Arch Body Hold", duration: "2m", description: "Berbaring tengkurap, angkat dada dan kaki. Tahan." },
      { name: "Hollow Body Hold", duration: "2m", description: "Berbaring terlentang, angkat bahu dan kaki. Tekan punggung bawah ke lantai." },
      { name: "Plank Variations", duration: "1m", description: "Side plank atau dynamic plank." }
    ]
  },
  10: {
    title: "Ring Chest Flys & Push-ups",
    focus: "Kekuatan Otot Dada (Push)",
    steps: [
      { name: "Standard Push-ups", duration: "3m", description: "3 set repetisi maksimal dengan form sempurna." },
      { name: "Wide/Diamond Push-ups", duration: "4m", description: "Fokus pada bagian luar atau otot tricep." },
      { name: "Scapula Push-ups", duration: "3m", description: "Fokus pada mobilitas belikat." }
    ]
  },
  15: {
    title: "Pull-up Power & Scapula",
    focus: "Kekuatan Punggung (Pull)",
    steps: [
      { name: "Scapula Pulls", duration: "3m", description: "Gantung aktif, gerakkan belikat naik turun." },
      { name: "Negative Pull-ups", duration: "6m", description: "Lompat ke atas, turun selambat mungkin." },
      { name: "Active Hang", duration: "6m", description: "Gantung pasif dan aktif bergantian untuk kekuatan grip." }
    ]
  },
  20: {
    title: "Handstand Practice & Tuck Front Levers",
    focus: "Keseimbangan & Upper Body",
    steps: [
      { name: "Wall Walks", duration: "5m", description: "Berjalan ke dinding dengan tangan hingga posisi vertikal." },
      { name: "Crow Pose", duration: "5m", description: "Latihan keseimbangan tangan dasar." },
      { name: "Tuck Front Lever Holds", duration: "10m", description: "Gantung di bar, tarik lutut ke dada, jaga punggung sejajar lantai." }
    ]
  },
  30: {
    title: "Full Muscle-Up Progressions",
    focus: "Eksplosivitas & Transisi",
    steps: [
      { name: "Explosive High Pulls", duration: "10m", description: "Tarik bar sekuat mungkin hingga menyentuh perut atau dada bawah." },
      { name: "Deep Bench Dips", duration: "10m", description: "Fokus pada kedalaman transisi muscle-up." },
      { name: "False Grip Work", duration: "10m", description: "Latih pegangan pergelangan tangan untuk transisi halus." }
    ]
  }
};

const DURATIONS = [1, 5, 10, 15, 20, 30];

export default function App() {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [currentRoutine, setCurrentRoutine] = useState<Routine | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setShowSuccess(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleGenerate = () => {
    if (selectedDuration && ROUTINES[selectedDuration]) {
      setCurrentRoutine(ROUTINES[selectedDuration]);
      setTimeLeft(selectedDuration * 60);
      setIsRunning(false);
      setShowSuccess(false);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    if (selectedDuration) setTimeLeft(selectedDuration * 60);
    setShowSuccess(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const markAsDone = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono selection:bg-emerald-500/30 selection:text-emerald-400 p-4 md:p-8 flex flex-col items-center">
      {/* --- Header --- */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="text-emerald-500 w-6 h-6" />
            <span className="text-sm font-bold text-emerald-500 tracking-widest uppercase">Kernel Mode Active</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 italic">
            CALI<span className="text-emerald-500">CODE</span>
          </h1>
          <p className="text-slate-400 max-w-md">
            Optimalkan waktu tunggu <span className="text-emerald-400">AI Task</span> dengan latihan kalistenik singkat.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Monitor className="w-4 h-4" />
            <span>Dev-Mode: Full</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>Health: 100%</span>
          </div>
        </div>
      </motion.header>

      {/* --- Main Content --- */}
      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Duration Selector */}
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl shadow-2xl backdrop-blur-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
              <Clock className="w-4 h-4" /> Durasi Break
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {DURATIONS.map((min) => (
                <button
                  key={min}
                  id={`btn-duration-${min}`}
                  onClick={() => setSelectedDuration(min)}
                  className={`
                    p-3 rounded-lg border text-sm font-bold transition-all duration-200
                    ${selectedDuration === min 
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800/80'}
                  `}
                >
                  {min}m
                </button>
              ))}
            </div>
            <button
              id="btn-generate"
              disabled={!selectedDuration}
              onClick={handleGenerate}
              className={`
                w-full mt-6 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                ${selectedDuration 
                  ? 'bg-white text-slate-950 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}
              `}
            >
              Generate Routine <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Additional "Bio" for the Senior Dev Persona */}
          <div className="p-4 border-l-2 border-emerald-500 bg-emerald-500/5 text-[10px] text-slate-400 uppercase tracking-tighter">
            "Software takes time to compile, but your body takes a lifetime to maintain. Don't let your health segfault while waiting for the agent."
          </div>
        </section>

        {/* Right Column: Routine & Timer */}
        <section className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!currentRoutine ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 group"
              >
                <div className="p-6 bg-slate-900 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-12 h-12" />
                </div>
                <p>Pilih durasi dan klik Generate</p>
                <code className="mt-2 text-[10px] opacity-40">await user.selectDuration();</code>
              </motion.div>
            ) : (
              <motion.div 
                key="active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Timer Display */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col items-center">
                  {/* Decorative Mesh Grid */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  
                  <div className="relative z-10 w-full flex flex-col items-center">
                    <div className="text-sm font-bold text-emerald-500 mb-2 tracking-[0.4em] uppercase">Session Timer</div>
                    <div className={`text-7xl md:text-8xl font-black mb-8 tracking-tighter transition-all duration-300 ${isRunning ? 'text-emerald-400 scale-105' : 'text-white'}`}>
                      {formatTime(timeLeft)}
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        id="btn-timer-toggle"
                        onClick={toggleTimer}
                        className={`
                          p-4 rounded-full transition-all duration-200 flex items-center justify-center
                          ${isRunning 
                            ? 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700' 
                            : 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-110'}
                        `}
                      >
                        {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current" />}
                      </button>
                      <button
                        id="btn-timer-reset"
                        onClick={resetTimer}
                        className="p-4 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                      >
                        <RotateCcw className="w-8 h-8 focus:rotate-180 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Complete Banner */}
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="absolute inset-0 bg-emerald-500 z-20 flex flex-col items-center justify-center text-slate-950 p-8 text-center"
                      >
                        <CheckCircle2 className="w-20 h-20 mb-4" />
                        <h3 className="text-4xl font-black italic">DEPLOYMENT SUCCESS!</h3>
                        <p className="mt-2 text-slate-900 font-bold">Latihan selesai. Tubuh kamu sudah 'recompiled'.</p>
                        <button 
                          onClick={() => setShowSuccess(false)}
                          className="mt-6 px-6 py-2 border-2 border-slate-950 rounded-full font-bold hover:bg-slate-950 hover:text-emerald-500 transition-colors"
                        >
                          Back to Terminal
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Routine Plan */}
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-2xl font-bold text-white italic">{currentRoutine.title}</h3>
                      <p className="text-xs text-emerald-500 uppercase tracking-widest mt-1">Focus: {currentRoutine.focus}</p>
                    </div>
                    <button 
                      onClick={markAsDone}
                      className="text-[10px] border border-slate-700 px-3 py-1 rounded text-slate-500 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
                    >
                      MARK AS DONE
                    </button>
                  </div>

                  <div className="space-y-4">
                    {currentRoutine.steps.map((step, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-emerald-500 text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-white text-sm">{step.name}</h4>
                            <span className="text-[10px] bg-slate-900 px-2 py-1 rounded text-emerald-400 border border-emerald-900/30">{step.duration}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="mt-auto pt-12 text-slate-600 text-[10px] flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <span>// STATUS: ACTIVE</span>
          <span>// VER: 1.0.4-LTS</span>
          <span>// CREATOR: SENIOR_DEV_ATHLETE</span>
        </div>
        <p className="max-w-md text-center opacity-50 italic">
          "The best pull request is a pull-up."
        </p>
      </footer>
    </div>
  );
}
