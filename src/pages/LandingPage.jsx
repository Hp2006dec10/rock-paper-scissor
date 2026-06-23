import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Scroll, Scissors, Play, Clock, Trophy, ShieldAlert, Cpu } from "lucide-react";
import ThreeBackground from "../components/ThreeBackground";

const CLASSIC_MODES = [
  { 
    id: "classic_5", 
    label: "Skirmish - 5 Points", 
    desc: "First to 5. Fast, intense duel.",
    icon: Trophy,
    color: "from-amber-400 to-yellow-500",
    glow: "group-hover:border-amber-500/40 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
  },
  { 
    id: "classic_10", 
    label: "Standard - 10 Points", 
    desc: "First to 10. The classic battle format.",
    icon: Trophy,
    color: "from-purple-400 to-indigo-500",
    glow: "group-hover:border-purple-500/40 group-hover:shadow-[0_0_15px_rgba(167,139,250,0.2)]"
  },
  { 
    id: "classic_20", 
    label: "Marathon - 20 Points", 
    desc: "First to 20. Advanced tactics and endurance.",
    icon: Trophy,
    color: "from-rose-400 to-pink-500",
    glow: "group-hover:border-rose-500/40 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
  },
];

const TIMED_MODES = [
  { 
    id: "sd_120", 
    label: "Blitz - 2 Minutes", 
    desc: "Time ticks down. Highest score claims victory.",
    icon: Clock,
    color: "from-sky-400 to-blue-500",
    glow: "group-hover:border-sky-500/40 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
  },
  { 
    id: "sd_300", 
    label: "Championship - 5 Minutes", 
    desc: "Long timed battle. Manage stress and pace.",
    icon: Clock,
    color: "from-emerald-400 to-teal-500",
    glow: "group-hover:border-emerald-500/40 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.2)]"
  },
];

const ModeModal = ({ onClose, onSelect }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-md px-4 z-50"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="glass-card w-[95%] max-w-[760px] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden max-h-[90vh] flex flex-col border border-white/10"
      >
        {/* Glow ambient meshes */}
        <div className="absolute -top-[120px] -left-[120px] w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-[120px] -right-[120px] w-[250px] h-[250px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="text-center mb-6 relative z-10">
          <motion.div variants={itemVariants} className="inline-flex p-2.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-3">
            <Cpu className="size-6 animate-pulse" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-extrabold tracking-wide uppercase">
            CHOOSE BATTLE FORMAT
          </motion.h2>
          <motion.p variants={itemVariants} className="text-sm text-slate-400 mt-1">
            Configure round scoring rules or battle timers
          </motion.p>
        </div>

        {/* Responsive Columns container */}
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-2">
          {/* Classic Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <p className="text-xs uppercase font-extrabold tracking-widest text-amber-400/80 flex items-center gap-1.5 px-1">
              <Trophy className="size-3.5" />
              Classic Points Race
            </p>
            <div className="grid gap-3">
              {CLASSIC_MODES.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    className={`glass-hover flex items-center gap-4 text-left p-3.5 rounded-2xl bg-white/3 border border-white/5 cursor-pointer w-full group relative overflow-hidden transition-all duration-300 ${mode.glow}`}
                    onClick={() => onSelect(mode.id)}
                  >
                    <div className={`p-2.5 rounded-xl bg-linear-to-r ${mode.color} text-black font-extrabold`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-base text-slate-100 group-hover:text-white transition-colors">{mode.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{mode.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Timed Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <p className="text-xs uppercase font-extrabold tracking-widest text-sky-400/80 flex items-center gap-1.5 px-1">
              <Clock className="size-3.5" />
              Sudden Death Timer
            </p>
            <div className="grid gap-3">
              {TIMED_MODES.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    className={`glass-hover flex items-center gap-4 text-left p-3.5 rounded-2xl bg-white/3 border border-white/5 cursor-pointer w-full group relative overflow-hidden transition-all duration-300 ${mode.glow}`}
                    onClick={() => onSelect(mode.id)}
                  >
                    <div className={`p-2.5 rounded-xl bg-linear-to-r ${mode.color} text-black font-extrabold`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-base text-slate-100 group-hover:text-white transition-colors">{mode.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{mode.desc}</p>
                    </div>
                  </button>
                );
              })}

              {/* Informational Tip Card to balance the layout height */}
              <div className="flex gap-3 p-3.5 rounded-2xl bg-sky-500/5 border border-sky-500/10 text-sky-300/80 items-start select-none">
                <ShieldAlert className="size-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-300">Timed Arena Rule</p>
                  <p className="text-[11px] leading-relaxed mt-0.5 text-sky-400/70">
                    The timer runs continuously. Points do not pause the clock. Maximize wins within the timeframe!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modal Footer */}
        <motion.div variants={itemVariants} className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center">
          <button
            type="button"
            className="w-full sm:w-1/2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 py-3.5 font-bold text-slate-300 hover:text-white cursor-pointer transition-all duration-300 active:scale-95 text-center"
            onClick={onClose}
          >
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Menu = ({ onPlayClick }) => {
  return (
    <div className="w-[90%] max-w-[650px] flex flex-col items-center text-center z-10">
      {/* Title block */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="mb-10 md:mb-14"
      >
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-wider text-shimmer neon-glow-purple uppercase select-none leading-none">
          BATTLE ARENA
        </h1>
        <p className="text-base sm:text-xl md:text-2xl text-purple-300/80 tracking-widest font-extrabold uppercase mt-4">
          Rock • Paper • Scissors
        </p>
        <div className="w-16 h-[2px] bg-purple-500/50 mx-auto mt-6"></div>
      </motion.div>

      {/* Play CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <button
          type="button"
          className="relative inline-flex items-center gap-3 px-14 py-5 text-xl font-black text-white uppercase rounded-2xl cursor-pointer overflow-hidden group shadow-lg transition-transform active:scale-95 bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 border border-purple-400/20"
          onClick={onPlayClick}
        >
          {/* Moving background glow */}
          <span className="absolute inset-0 w-full h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          {/* Animated pulse halo */}
          <span className="absolute -inset-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></span>
          
          <Play className="size-6 fill-white stroke-none group-hover:translate-x-1 transition-transform" />
          <span className="relative z-10 tracking-widest">Enter Arena</span>
        </button>
      </motion.div>
    </div>
  );
};

function LandingPage() {
  const [showModes, setShowModes] = useState(false);
  const navigate = useNavigate();

  const handleModeSelect = (mode) => {
    setShowModes(false);
    navigate("/game", { state: { mode } });
  };

  return (
    <div className="bg-[#030008] h-[100dvh] w-screen overflow-hidden relative flex items-center justify-center px-4">
      {/* 3D background rendering */}
      <ThreeBackground state="idle" />

      {/* Landing Menu */}
      <Menu onPlayClick={() => setShowModes(true)} />

      {/* Modal with entry/exit animations */}
      <AnimatePresence>
        {showModes && (
          <ModeModal onClose={() => setShowModes(false)} onSelect={handleModeSelect} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingPage;