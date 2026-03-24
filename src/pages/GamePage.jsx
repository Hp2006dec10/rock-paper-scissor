import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import api from "./axios";

const MODE_CONFIG = {
  classic_5: { type: "classic", scoreToWin: 5, label: "Classic - 5 points" },
  classic_10: { type: "classic", scoreToWin: 10, label: "Classic - 10 points" },
  classic_20: { type: "classic", scoreToWin: 20, label: "Classic - 20 points" },
  sd_120: { type: "suddenDeath", duration: 120, label: "Sudden Death - 2 minutes" },
  sd_300: { type: "suddenDeath", duration: 300, label: "Sudden Death - 5 minutes" },
};

const ScoreBoard = ({ hScore, cScore, timerText }) => {
  return (
    <div className="glass w-[85%] max-w-[600px] py-3 mx-auto px-3 md:px-5 text-white rounded-xl">
      <div className="flex justify-evenly items-center text-xl">
        <div className="text-center">
          <p className="text-base md:text-lg lg:text-xl">Player</p>
          <p className="text-2xl lg:text-4xl">{hScore}</p>
        </div>
        <div className="text-[30px] my-auto hidden md:block font-semibold">SCORE </div>
        <div className="text-center">
          <p className="text-base md:text-lg lg:text-xl">Computer</p>
          <p className="text-2xl lg:text-4xl">{cScore}</p>
        </div>
      </div>
      {timerText && <p className="text-center pt-2 text-sm md:text-base">{timerText}</p>}
    </div>
  );
};

const HumanBoard = ({ humanInput }) => {
  return (
    <div className="size-100 sm:size-125 md:size-150 glass-purple-light rounded-lg overflow-hidden">
      {humanInput && <img src={`images/${humanInput}.jpg`} className="h-full w-full" />}
    </div>
  );
};

const ComputerBoard = ({ values, doesStart, current }) => {
  return (
    <div className="size-100 sm:size-125 md:size-150 glass-blue-light rounded-lg overflow-hidden">
      {doesStart && <img src={`images/${values[current]}.jpg`} className="h-full w-full" />}
    </div>
  );
};

const ChoiceBox = ({ handleClick, shouldDisable }) => {
  const baseClass =
    "z-20 glass glass-hover px-4 sm:px-6 py-2.5 md:py-3 min-w-[75px] md:min-w-[130px] rounded-lg text-base md:text-xl lg:text-2xl text-white cursor-pointer";
  return (
    <div
      className={`flex flex-wrap mx-auto gap-15 md:gap-20 items-center justify-center ${shouldDisable ? "pointer-events-none opacity-50 grayscale cursor-not-allowed" : ""} w-[95%] md:w-[65%]`}
    >
      <button type="button" className={baseClass} onClick={() => handleClick(0)}>
        Rock
      </button>
      <button type="button" className={baseClass} onClick={() => handleClick(1)}>
        Paper
      </button>
      <button type="button" className={baseClass} onClick={() => handleClick(2)}>
        Scissor
      </button>
    </div>
  );
};

const Popup = ({ title, onPrimary, onSecondary, primaryLabel, secondaryLabel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black px-4">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 size-300 md:size-500 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
        <div
          className="absolute bottom-0 right-0 size-300 md:size-500 bg-blue-500/10 rounded-full blur-3xl float-animation"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
      <div className="z-30 glass w-4/5 md:w-1/3 lg:w-1/5 rounded-xl px-4 py-20 text-white">
        <p className="text-center text-xl md:text-2xl mb-5">{title}</p>
        <div className="flex gap-15 w-9/10 mx-auto mt-25 lg:mt-40">
          <button
            type="button"
            className="w-1/2 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer"
            onClick={onPrimary}
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            className="w-1/2 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer"
            onClick={onSecondary}
          >
            {secondaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageBox = ({ message, showLoader }) => {
  return (
    <div className="text-center text-base md:text-xl lg:text-2xl text-[rgb(254,245,151)] px-4 min-h-10 flex items-center justify-center gap-2">
      <span>{message}</span>
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

  const timerText = useMemo(() => {
    if (modeConfig.type !== "suddenDeath") return null;
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = String(secondsLeft % 60).padStart(2, "0");
    return `Time Left: ${minutes}:${seconds}`;
  }, [secondsLeft, modeConfig.type]);

  useEffect(() => {
    if (modeConfig.type === "suddenDeath") setMessage("Start the game to start the timer!!!");
  },[])

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
      }, 1000);
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
  }, [gameOver]);

  useEffect(() => {
    if (!gameOver || !gameEnd || !localStorage.getItem("token")) return;
    const saveGame = async () => {
      try {
        const user = jwtDecode(localStorage.getItem("token"));
        const data = { email: user.email, scoreHistory, inputHistory, gameStart, gameEnd };
        const response = await api.post("/game", data);
        if (response.data.message) console.log(response.data.message);
      } catch (err) {
        console.log(err);
        console.log(err.response?.data.error);
      }
    };
    saveGame();
  }, [gameOver, gameEnd, scoreHistory, inputHistory, gameStart]);

  const handleHumanInput = (data) => {
    if (gameOver) return;
    if (!hasStarted) {
      setHasStarted(true);
      setGameStart(Date.now());
    }
    setMessage("Waiting for computer input...");
    setHuman(arr[data]);
    changeInpInd(0);
    setComputerStart(true);
    handleComputerInput();
  };
  const handleComputerInput = () => {
    const input = setInterval(() => {
      changeInpInd((curr) => (curr < 2 ? curr + 1 : 0));
    }, 100);

    setTimeout(() => {
      clearInterval(input);
      const finalValue = Math.floor(Math.random() * 3);
      changeInpInd(finalValue);
      setComputer(arr[finalValue]);
    }, 1000);
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
  };

  const handleExit = () => navigate("/");
  const handleForceExit = () => checkExit(true);

  return (
    <>
      <div
        className={`relative flex flex-col w-full bg-black justify-evenly h-[100dvh] overflow-hidden px-2 md:px-4 ${gameOver || forceExit ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="absolute top-0 left-0 size-300 md:size-500 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
        <div
          className="absolute bottom-0 right-0 size-300 md:size-500 bg-blue-500/10 rounded-full blur-3xl float-animation"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div>
          <p className="text-[24px] md:text-[32px] text-center font-bold bg-linear-135 from-red-500 to-blue-600 bg-clip-text text-transparent">ROCK PAPER SCISSOR</p>
          <p className="text-center text-slate-200 text-sm md:text-base md:text-lg">{modeConfig.label}</p>
        </div>
        <ScoreBoard hScore={humanScore} cScore={computerScore} timerText={timerText} />
        <MessageBox message={message} showLoader={message.toLowerCase().includes("waiting")} />
        <div className="flex justify-evenly h-fit w-full md:w-4/5 mx-auto py-1">
          <HumanBoard humanInput={humanInput} />
          <ComputerBoard values={arr} doesStart={computerStart} current={currInpInd} />
        </div>
        <ChoiceBox handleClick={handleHumanInput} shouldDisable={computerStart || (gameOver && !forceExit)} />
        <div className="w-9/10 md:w-1/2 flex justify-end mx-auto z-20">
            <button
            className="glass glass-hover w-fit h-fit px-6 py-2 md:py-2.5 text-center md:text-xl text-white cursor-pointer rounded-sm"
            onClick={handleForceExit}
            >
                Back
            </button>
        </div>
      </div>
      {gameOver && !forceExit && (
        <Popup
          title={winner === "No one" ? "Time up! It's a draw." : `${winner} won`}
          onPrimary={handleRestart}
          onSecondary={handleExit}
          primaryLabel="Restart"
          secondaryLabel="Exit"
        />
      )}
      {forceExit && (
        <Popup
          title="Are you sure you want to exit?"
          onPrimary={handleExit}
          onSecondary={() => checkExit(false)}
          primaryLabel="Yes"
          secondaryLabel="No"
        />
      )}
    </>
  );
};

export default GamePage;