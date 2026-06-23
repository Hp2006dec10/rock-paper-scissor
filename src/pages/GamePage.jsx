import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Scroll, Scissors, Trophy, LogOut, ArrowLeft, Zap, Skull, Activity, Hourglass } from "lucide-react";
import ThreeBackground from "../components/ThreeBackground";

const MODE_CONFIG = {
  classic_5: { type: "classic", scoreToWin: 5, label: "Classic - 5 points" },
  classic_10: { type: "classic", scoreToWin: 10, label: "Classic - 10 points" },
  classic_20: { type: "classic", scoreToWin: 20, label: "Classic - 20 points" },
  sd_120: { type: "suddenDeath", duration: 120, label: "Sudden Death - 2 minutes" },
  sd_300: { type: "suddenDeath", duration: 300, label: "Sudden Death - 5 minutes" },
};

const CHOICE_META = {
  Rock: {
    icon: Sparkles,
    glow: "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    color: "from-amber-400 to-red-500",
    bg: "rgba(245,158,11,0.05)"
  },
  Paper: {
    icon: Scroll,
    glow: "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    color: "from-emerald-400 to-blue-500",
    bg: "rgba(16,185,129,0.05)"
  },
  Scissor: {
    icon: Scissors,
    glow: "border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.25)]",
    color: "from-indigo-400 to-purple-600",
    bg: "rgba(99,102,241,0.05)"
  }
};

/* 60FPS Canvas particle burst for round victories */
const ParticleBlast = ({ trigger, color = "#f59e0b" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const particles = [];
    const particleCount = 45;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 3;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 1.5),
        size: Math.random() * 3 + 1.5,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
      });
    }

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.alpha -= p.decay;
        if (p.alpha > 0) {
          alive = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
      });
      if (alive) {
        animId = requestAnimationFrame(render);
      }
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [trigger, color]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-30" />;
};

/* Full screen celebration confetti loop on Victory */
const ConfettiRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const confettiCount = 100;
    const colors = ["#8b5cf6", "#3b82f6", "#ec4899", "#f59e0b", "#10b981"];
    const pieces = [];

    for (let i = 0; i < confettiCount; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 20,
        size: Math.random() * 6 + 5,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.rotation += p.rotationSpeed;
        
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-40" />;
};

const ScoreBoard = ({ hScore, cScore, timerText }) => {
  return (
    <div className="glass w-[90%] max-w-[600px] py-4 mx-auto px-6 text-white rounded-2xl relative overflow-hidden z-10 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
      <div className="flex justify-evenly items-center text-xl relative z-10">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-purple-300 font-semibold mb-1">Player</p>
          <motion.p 
            key={`h-${hScore}`}
            animate={{ scale: [1, 1.3, 1], color: ["#fff", "#a78bfa", "#fff"] }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-5xl font-extrabold font-mono"
          >
            {hScore}
          </motion.p>
        </div>
        <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
        <div className="text-center hidden md:block">
          <p className="text-xs tracking-widest text-slate-400 font-bold uppercase">SCORE</p>
        </div>
        <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-1">Computer</p>
          <motion.p 
            key={`c-${cScore}`}
            animate={{ scale: [1, 1.3, 1], color: ["#fff", "#60a5fa", "#fff"] }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-5xl font-extrabold font-mono"
          >
            {cScore}
          </motion.p>
        </div>
      </div>
      {timerText && (
        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-white/5 text-slate-300 font-medium">
          <Hourglass className="size-4 text-amber-400 animate-pulse" />
          <span className="font-mono text-base tracking-wider">{timerText}</span>
        </div>
      )}
    </div>
  );
};

const CardFrame = ({ choice, isShaking, side, shakePhase, blastTrigger, blastColor }) => {
  const meta = CHOICE_META[choice];
  const Icon = meta?.icon;

  return (
    <div className="relative">
      <ParticleBlast trigger={blastTrigger} color={blastColor} />
      <motion.div
        animate={isShaking ? {
          y: [-12, 12, -12],
          rotate: side === "left" ? [-1.5, 3, -1.5] : [1.5, -3, 1.5]
        } : { y: 0, rotate: 0 }}
        transition={isShaking ? {
          repeat: Infinity,
          duration: 0.25,
          ease: "easeInOut"
        } : {}}
        className={`w-[130px] h-[180px] sm:w-[170px] sm:h-[240px] rounded-2xl glass flex flex-col items-center justify-center p-2 relative overflow-hidden border-2 transition-all duration-300 ${
          isShaking 
            ? "border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
            : choice 
              ? meta?.glow 
              : "border-white/10"
        }`}
      >
        {/* Shimmer layout pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_6px] pointer-events-none opacity-40"></div>

        {isShaking ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-radial-gradient(circle, rgba(139,92,246,0.1)_0%, transparent_70%) animate-pulse"></div>
            <div className="relative p-3 rounded-full bg-white/5 border border-white/10 text-purple-400 animate-bounce">
              <Zap className="size-8 sm:size-12" />
            </div>
            <p className="mt-4 text-xs font-bold tracking-widest text-purple-300 uppercase animate-pulse">{shakePhase}</p>
          </div>
        ) : choice ? (
          <div className="w-full h-full flex flex-col items-center justify-between p-2">
            <span className={`text-[10px] tracking-widest uppercase font-semibold text-slate-400 ${side === "left" ? "self-start" : "self-end"}`}>
              {side === "left" ? "PLAYER" : "ARENA BOT"}
            </span>
            <div className="w-full h-[65%] rounded-xl overflow-hidden border border-white/5 shadow-inner relative group bg-black/40">
              <img 
                src={`images/${choice}.jpg`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={choice}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              {Icon && <Icon className="size-4 text-slate-200" />}
              <span className="text-sm sm:text-base font-bold tracking-wide text-slate-200">{choice}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500">
            <div className="p-3 rounded-full bg-white/2 border border-white/5 mb-3">
              <Activity className="size-8 sm:size-12 opacity-30" />
            </div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Awaiting Choice</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const ChoiceBox = ({ handleClick, shouldDisable }) => {
  const choices = [
    { id: 0, label: "Rock", icon: Sparkles, color: "hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] bg-amber-500/5 border-amber-500/10 text-amber-200" },
    { id: 1, label: "Paper", icon: Scroll, color: "hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-500/5 border-emerald-500/10 text-emerald-200" },
    { id: 2, label: "Scissor", icon: Scissors, color: "hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] bg-indigo-500/5 border-indigo-500/10 text-indigo-200" }
  ];

  return (
    <div
      className={`flex flex-wrap mx-auto gap-4 md:gap-6 items-center justify-center ${
        shouldDisable ? "pointer-events-none opacity-40 grayscale cursor-not-allowed" : ""
      } w-[95%] md:w-[65%] z-20`}
    >
      {choices.map((choice) => {
        const Icon = choice.icon;
        return (
          <button
            key={choice.id}
            type="button"
            className={`flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 min-w-[120px] sm:min-w-[150px] md:min-w-[170px] rounded-2xl glass font-bold text-base sm:text-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 border ${choice.color}`}
            onClick={() => handleClick(choice.id)}
          >
            <Icon className="size-5" />
            <span>{choice.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const Popup = ({ title, onPrimary, onSecondary, primaryLabel, secondaryLabel, winner }) => {
  const isVictory = winner === "You";
  const isDefeat = winner === "Computer";
  const isDraw = winner === "No one";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 z-50 pointer-events-auto"
    >
      {isVictory && <ConfettiRain />}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`glass-card w-[95%] sm:w-[420px] rounded-3xl p-8 text-center relative overflow-hidden border-2 ${
          isVictory 
            ? "border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]" 
            : isDefeat 
              ? "border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]" 
              : "border-purple-500/20"
        }`}
      >
        {isVictory && (
          <div className="flex flex-col items-center mb-4">
            <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-bounce">
              <Trophy className="size-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-amber-400 tracking-wider mt-2 neon-glow-gold uppercase">VICTORY</h2>
          </div>
        )}

        {isDefeat && (
          <div className="flex flex-col items-center mb-4">
            <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 screen-shake">
              <Skull className="size-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-red-500 tracking-wider mt-2 uppercase glitch-text" data-text="DEFEATED">DEFEATED</h2>
          </div>
        )}

        {isDraw && (
          <div className="flex flex-col items-center mb-4">
            <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Activity className="size-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-blue-400 tracking-wider mt-2 uppercase">DRAW GAME</h2>
          </div>
        )}

        {!winner && (
          <div className="flex flex-col items-center mb-4 text-purple-400">
            <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20">
              <LogOut className="size-10" />
            </div>
          </div>
        )}

        <p className="text-lg text-slate-300 font-medium my-4">{title}</p>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            className={`w-1/2 py-3.5 rounded-xl font-bold transition-all duration-300 active:scale-95 cursor-pointer ${
              isVictory 
                ? "bg-amber-500 hover:bg-amber-600 text-black" 
                : isDefeat 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
            onClick={onPrimary}
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            className="w-1/2 py-3.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 hover:text-white transition-all duration-300 active:scale-95 cursor-pointer"
            onClick={onSecondary}
          >
            {secondaryLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MessageBox = ({ message, showLoader }) => {
  const isWin = message.toLowerCase().includes("you won");
  const isDraw = message.toLowerCase().includes("draw");
  const isDefeat = message.toLowerCase().includes("computer won");
  
  let colorClass = "text-purple-300";
  if (isWin) colorClass = "text-emerald-400 neon-glow-green font-bold";
  if (isDefeat) colorClass = "text-red-400 neon-glow-red font-bold";
  if (isDraw) colorClass = "text-blue-400 font-bold";

  return (
    <div className="text-center h-12 flex items-center justify-center gap-3">
      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`text-lg sm:text-2xl font-bold tracking-wide uppercase ${colorClass}`}
        >
          {message}
        </motion.p>
      </AnimatePresence>
      {showLoader && <span className="loading-dot" aria-hidden="true"></span>}
    </div>
  );
};

const GamePage = () => {
  const arr = { 0: "Rock", 1: "Paper", 2: "Scissor" };
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMode = location.state?.mode ?? "classic_10";
  const modeConfig = MODE_CONFIG[selectedMode] ?? MODE_CONFIG.classic_10;

  const [message, setMessage] = useState("Start");
  const [humanInput, setHuman] = useState(null);
  const [computerInput, setComputer] = useState(null);
  const [computerStart, setComputerStart] = useState(false);
  const [currInpInd, changeInpInd] = useState(0);
  const [humanScore, updateHumanScore] = useState(0);
  const [computerScore, updatecomputerScore] = useState(0);
  const [isDraw, controlDraw] = useState(false);
  const [gameOver, endGame] = useState(false);
  const [winner, setWinner] = useState(null);
  const [forceExit, checkExit] = useState(false);
  const [scoreHistory, storeScore] = useState([]);
  const [gameStart, setGameStart] = useState(Date.now());
  const [gameEnd, setGameEnd] = useState(null);
  const [inputHistory, storeInput] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(modeConfig.duration ?? 0);
  const [hasStarted, setHasStarted] = useState(false);

  // Custom visual state extensions
  const [isShaking, setIsShaking] = useState(false);
  const [shakePhase, setShakePhase] = useState("ROCK");
  const [screenShakeActive, setScreenShakeActive] = useState(false);
  const [playerBlastTrigger, setPlayerBlastTrigger] = useState(0);
  const [computerBlastTrigger, setComputerBlastTrigger] = useState(0);
  const [backgroundState, setBackgroundState] = useState("idle");

  const timerText = useMemo(() => {
    if (modeConfig.type !== "suddenDeath") return null;
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = String(secondsLeft % 60).padStart(2, "0");
    return `Time Left: ${minutes}:${seconds}`;
  }, [secondsLeft, modeConfig.type]);

  useEffect(() => {
    if (modeConfig.type === "suddenDeath") setMessage("Make a choice to start the battle timer!");
  }, [modeConfig]);

  useEffect(() => {
    if (humanInput !== computerInput) {
      if (
        (computerInput === "Scissor" && humanInput === "Rock") ||
        (computerInput === "Rock" && humanInput === "Paper") ||
        (computerInput === "Paper" && humanInput === "Scissor")
      ) {
        updateHumanScore((curr) => curr + 1);
        setMessage("You won this round!");
      } else if (
        (computerInput === "Rock" && humanInput === "Scissor") ||
        (computerInput === "Paper" && humanInput === "Rock") ||
        (computerInput === "Scissor" && humanInput === "Paper")
      ) {
        updatecomputerScore((curr) => curr + 1);
        setMessage("Computer won this round!");
      }
    } else if (humanInput === computerInput && humanInput !== null) {
      setMessage("Draw!");
      controlDraw(true);
    }
  }, [humanInput, computerInput]);

  useEffect(() => {
    if (humanInput && (humanScore > 0 || computerScore > 0 || isDraw)) {
      if (!isDraw) {
        storeScore((prev) => [...prev, [computerScore, humanScore]]);
        storeInput((prev) => [...prev, [computerInput, humanInput]]);
      }
      const timeout = setTimeout(() => {
        setMessage("Start");
        setHuman(null);
        setComputer(null);
        setComputerStart(false);
        if (isDraw) controlDraw(false);
      }, 2500);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [humanScore, computerScore, isDraw, humanInput, computerInput]);

  useEffect(() => {
    if (modeConfig.type !== "classic") return;
    if (humanScore === modeConfig.scoreToWin) {
      endGame(true);
      setWinner("You");
    } else if (computerScore === modeConfig.scoreToWin) {
      endGame(true);
      setWinner("Computer");
    }
  }, [humanScore, computerScore, modeConfig]);

  useEffect(() => {
    if (modeConfig.type !== "suddenDeath" || !hasStarted || gameOver) return;
    const timer = setInterval(() => {
      setSecondsLeft((curr) => {
        if (curr <= 1) {
          clearInterval(timer);
          endGame(true);
          if (humanScore > computerScore) setWinner("You");
          else if (computerScore > humanScore) setWinner("Computer");
          else setWinner("No one");
          return 0;
        }
        return curr - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [modeConfig.type, hasStarted, gameOver, humanScore, computerScore]);

  useEffect(() => {
    if (!gameOver) return;
    const endedAt = new Date().toLocaleString();
    setGameEnd(endedAt);

    if (winner === "You") {
      setBackgroundState("victory");
    } else if (winner === "Computer") {
      setBackgroundState("defeat");
    }
  }, [gameOver, winner]);

  const handleHumanInput = (data) => {
    if (gameOver || isShaking) return;
    if (!hasStarted) {
      setHasStarted(true);
      setGameStart(Date.now());
    }

    // Enter Shake / Clash mode
    setIsShaking(true);
    setHuman(null);
    setComputer(null);
    setComputerStart(false);
    setBackgroundState("clashing");
    
    // Countdown
    setShakePhase("ROCK");
    setMessage("ROCK...");

    const shuffle = setInterval(() => {
      changeInpInd((curr) => (curr < 2 ? curr + 1 : 0));
    }, 100);

    setTimeout(() => {
      setShakePhase("PAPER");
      setMessage("PAPER...");
    }, 400);

    setTimeout(() => {
      setShakePhase("SCISSORS");
      setMessage("SCISSORS...");
    }, 800);

    setTimeout(() => {
      clearInterval(shuffle);
      setIsShaking(false);
      setScreenShakeActive(true);
      
      const humanChoice = arr[data];
      const compRandomVal = Math.floor(Math.random() * 3);
      const compChoice = arr[compRandomVal];
      
      changeInpInd(compRandomVal);
      setHuman(humanChoice);
      setComputer(compChoice);
      setComputerStart(true);
      setBackgroundState("idle");

      // Stop screen shake after a flash
      setTimeout(() => setScreenShakeActive(false), 500);

      // Trigger particle blast on the side of the winner
      if (humanChoice !== compChoice) {
        if (
          (compChoice === "Scissor" && humanChoice === "Rock") ||
          (compChoice === "Rock" && humanChoice === "Paper") ||
          (compChoice === "Paper" && humanChoice === "Scissor")
        ) {
          setPlayerBlastTrigger(prev => prev + 1);
        } else {
          setComputerBlastTrigger(prev => prev + 1);
        }
      }
    }, 1200);
  };

  const handleRestart = () => {
    endGame(false);
    setWinner(null);
    updateHumanScore(0);
    updatecomputerScore(0);
    setMessage("Start");
    storeScore([]);
    storeInput([]);
    setHuman(null);
    setComputer(null);
    setComputerStart(false);
    controlDraw(false);
    checkExit(false);
    setHasStarted(false);
    setGameStart(Date.now());
    setGameEnd(null);
    setSecondsLeft(modeConfig.duration ?? 0);
    setBackgroundState("idle");
  };

  const handleExit = () => navigate("/");
  const handleForceExit = () => checkExit(true);

  return (
    <>
      <div
        className={`relative flex flex-col w-full bg-black justify-evenly h-[100dvh] overflow-hidden px-4 select-none ${
          screenShakeActive ? "screen-shake" : ""
        } ${gameOver || forceExit ? "pointer-events-none opacity-40 cursor-not-allowed" : "pointer-events-auto"}`}
      >
        {/* Dynamic 3D starfield particles background */}
        <ThreeBackground state={backgroundState} />

        {/* Header arena label */}
        <div className="z-10 text-center">
          <p className="text-sm tracking-widest font-extrabold text-purple-400 uppercase">CHAMPIONSHIP ARENA</p>
          <p className="text-2xl sm:text-4xl font-extrabold text-slate-100 mt-1 uppercase tracking-wide">{modeConfig.label}</p>
        </div>

        {/* Glowing Score Board */}
        <ScoreBoard hScore={humanScore} cScore={computerScore} timerText={timerText} />

        {/* Interactive MessageBox */}
        <MessageBox message={message} showLoader={message.toLowerCase().includes("waiting") || isShaking} />

        {/* Combat visual area */}
        <div className="flex justify-center items-center gap-6 sm:gap-12 md:gap-20 py-2 z-10 w-full">
          <CardFrame 
            choice={humanInput} 
            isShaking={isShaking} 
            side="left" 
            shakePhase={shakePhase} 
            blastTrigger={playerBlastTrigger}
            blastColor="#34d399"
          />
          <span className="text-xl sm:text-2xl font-black text-slate-500 tracking-wider">VS</span>
          <CardFrame 
            choice={computerStart ? computerInput || arr[currInpInd] : null} 
            isShaking={isShaking} 
            side="right" 
            shakePhase={shakePhase} 
            blastTrigger={computerBlastTrigger}
            blastColor="#a78bfa"
          />
        </div>

        {/* Options grid */}
        <ChoiceBox handleClick={handleHumanInput} shouldDisable={isShaking || computerStart || (gameOver && !forceExit)} />

        {/* Back navigation CTA */}
        <div className="w-[90%] md:w-[65%] flex justify-end mx-auto z-20">
          <button
            type="button"
            className="glass glass-hover inline-flex items-center gap-2 px-6 py-2.5 text-center font-bold text-slate-200 hover:text-white cursor-pointer rounded-xl border border-white/5 transition-all"
            onClick={handleForceExit}
          >
            <ArrowLeft className="size-4" />
            <span>Abandon Arena</span>
          </button>
        </div>
      </div>

      {/* Popups & Game Over screens */}
      <AnimatePresence>
        {gameOver && !forceExit && (
          <Popup
            title={winner === "No one" ? "Time expired! Match ended in a draw." : winner === "You" ? "Congratulations, you won the match!" : "Game Over. The Arena Bot outsmarted you."}
            onPrimary={handleRestart}
            onSecondary={handleExit}
            primaryLabel="Rebattle"
            secondaryLabel="Leave"
            winner={winner}
          />
        )}
        {forceExit && (
          <Popup
            title="Are you sure you want to abandon the match? Your current score progress will be lost."
            onPrimary={handleExit}
            onSecondary={() => checkExit(false)}
            primaryLabel="Yes, Exit"
            secondaryLabel="No, Battle"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default GamePage;