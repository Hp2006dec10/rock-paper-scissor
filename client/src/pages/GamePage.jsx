import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import api from "./axios";

const ScoreBoard = ({hScore, cScore}) => {
    return (
        <div className="h-100 w-[80vw] justify-self-center mt-30 -outline-offset-7 outline-3 outline-dotted bg-black text-white">        
            <div className="flex justify-evenly pt-10 text-xl">
                <div className="text-center">
                <p>Computer</p>
                <p className="text-4xl">{cScore}</p>
                </div>
                <div className="text-[60px] -mt-5">SCORE </div>
                <div className="text-center">
                <p>Player</p>
                <p className="text-4xl">{hScore}</p>
                </div>
            </div>
        </div>
    )
}

const HumanBoard = ({humanInput}) => {
    return (
        <div className="h-300 w-300 bg-white">
            {humanInput && <img src={`images/${humanInput}.jpg`} className="h-300 w-300"/>}
        </div>
    )
}

const ComputerBoard = ({values,doesStart, current}) => {    
    return (
        <div className="h-300 w-300 bg-white">
            {doesStart && <img src={`images/${values[current]}.jpg`} className="h-300 w-300"/>}
        </div>
    )
}

const ChoiceBox = ({handleClick, shouldDisable}) => {
    return (
        <div className={`flex gap-30 pt-30 ml-950 ${shouldDisable ? "pointer-events-none opacity-50 grayscale cursor-not-allowed":""}`}>
            <div className="h-50 w-150 bg-black flex rounded-full text-2xl justify-center items-center text-white cursor-pointer"  onClick={()=>handleClick(0)}>Rock</div>
            <div className="h-50 w-150 bg-black flex rounded-full text-2xl justify-center items-center text-white cursor-pointer" onClick={()=>handleClick(1)}>Paper</div>
            <div className="h-50 w-150 bg-black flex rounded-full text-2xl justify-center items-center text-white cursor-pointer" onClick={()=>handleClick(2)}>Scissor</div>
        </div>
    )
}

const GameOver = ({winner, handleExit, handleRestart}) => {
    return (
        <div className="h-200 w-400 bg-gradient-to-r from-[rgb(180,60,150)] from-20% via-[rgb(140,30,130)] via-50% to-[rgb(100,20,120)] via-90% absolute top-[calc(50%-100px)] left-[calc(50%-200px)]">
            <div className="col-span-2 justify-self-center text-2xl text-white pt-30 pb-50">{winner} won</div>
            <div className="flex justify-around w-400">
                <div className="text-center h-fit w-75 p-10 text-xl border-box bg-white cursor-pointer shadow-xl" onClick={handleRestart}>Restart</div>
                <div className="text-center h-fit w-75 p-10 text-xl border-box bg-white cursor-pointer shadow-xl" onClick={handleExit}>Exit</div>
            </div>
        </div>
    )
}

const Back = ({handleExit, checkExit, endGame}) => {
    return (
        <div className="h-200 w-400 bg-gradient-to-r from-[rgb(156,57,131)] from-20% via-[rgb(140,30,130)] via-50% to-[rgb(100,20,120)] absolute top-[calc(50%-100px)] left-[calc(50%-200px)]">
            <div className="col-span-2 justify-self-center text-2xl text-white pt-30 pb-50">Are you sure want to Exit</div>
            <div className="flex justify-around w-400">
                <div className="text-center h-fit w-75 p-10 text-xl border-box bg-white cursor-pointer" onClick={handleExit}>Yes</div>
                <div className="text-center h-fit w-75 p-10 text-xl border-box bg-white cursor-pointer" onClick={()=> {checkExit(false);endGame(false)}}>No</div>
            </div>
        </div>
    )   
}

const GamePage = () => {
    const arr = {0: "Rock", 1: "Paper", 2 : "Scissor"};
    const [message,setMessage] = useState("Start");
    const [humanInput,setHuman] = useState(null);
    const [computerInput, setComputer] = useState(null);
    const [computerStart, setComputerStart] = useState(false);
    const [currInpInd,changeInpInd] = useState(0);
    const [humanScore, updateHumanScore] = useState(0);
    const [computerScore, updatecomputerScore] = useState(0);
    const [isDraw, controlDraw] = useState(false);
    const [gameOver, endGame] = useState(false);
    const [winner, setWinner] = useState(null);
    const [forceExit, checkExit] = useState(false);
    const navigate = useNavigate();
    const [scoreHistory,storeScore] = useState([]);
    const [gameStart, setGameStart] = useState(null);
    const [gameEnd, setGameEnd] = useState(null);
    const [inputHistory, storeInput] = useState([]);

    // useEffect(()=>{if (scoreHistory.length > 0) console.log(JSON.stringify(scoreHistory))},[scoreHistory]);
    // useEffect(()=>{if(gameStart!= null) console.log("Game started at: ",gameStart)},[gameStart]

    useEffect(()=>{
        if (humanInput!= null && computerInput != null) console.log(humanInput + ", "+ computerInput);
        if (humanInput != computerInput){
            if (computerInput == "Scissor" && humanInput == "Rock" || 
                computerInput == "Rock"  && humanInput == "Paper"|| 
                computerInput == "Paper" && humanInput == "Scissor" ){
                updateHumanScore(curr => curr + 1);
                setMessage("You won!!!");
            }
            else if (computerInput == "Rock" && humanInput == "Scissor" || 
                    computerInput == "Paper"  && humanInput == "Rock" || 
                    computerInput == "Scissor" && humanInput == "Paper"){
                updatecomputerScore(curr => curr + 1);
                setMessage("Computer won!!!")
            }
        }
        else if (humanInput == computerInput && humanInput != null){
            setMessage("Draw!!!")
            controlDraw(true);
        }
    },[humanInput,computerInput]);

    useEffect(()=>{
        if (humanInput && (humanScore > 0 || computerScore > 0 || isDraw)){
            if (!isDraw) {
                storeScore(prev => [...prev, [computerScore, humanScore]]);
                storeInput(prev => [...prev,[computerInput, humanInput]]);
            }
            setTimeout(()=>{
                setMessage("Start");
                setHuman(null);
                setComputer(null);
                setComputerStart(false);
                if (isDraw) {
                    controlDraw(false);
                }
                if (humanScore === 10) {
                    endGame(true);
                    setWinner("You");
                }
                else if (computerScore === 10){
                    endGame(true); 
                    setWinner("Computer")
                };
            }, 1000);
        }
    }, [humanScore, computerScore, isDraw]);

    useEffect(()=>{
        if(!gameOver) setGameStart(Date.now);
        else {
            setGameEnd(Date().toLocaleString());
            if (localStorage.getItem("token")) saveGame();

    }},[gameOver]);

    const saveGame = async () => {
        try{
            const user = jwtDecode(localStorage.getItem("token"));
            const data = {email: user.email, scoreHistory, inputHistory, gameStart, gameEnd };
            const response = await api.post('/game', data);
            if (response.data.message) console.log(response.data.message);
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data.error);
        }
    }

    const handleHumanInput = (data) => {
        setMessage("Waiting for computer input");
        setHuman(arr[data]);
        changeInpInd(0);
        setComputerStart(true);
        handleComputerInput();
    }
    const handleComputerInput = () => {
        let input = setInterval(() => {
            changeInpInd((curr) => (curr < 2 ? curr + 1 : 0));
        }, 100);
    
        setTimeout(() => {
            clearInterval(input);
            const finalValue = Math.floor(Math.random() * 3);
            changeInpInd(finalValue);
            setComputer(arr[finalValue]);
        }, 1000);
    };
    
    const handleRestart = () =>{
        endGame(false);
        setWinner(null);
        updateHumanScore(0);
        updatecomputerScore(0);
        setMessage("Start");
        storeScore([]);
        storeInput([]);
    }

    const handleExit = () => navigate("/");
    
    const handleForceExit = () => {checkExit(true);endGame(true)};
    return (
    <>
   <div className={`bg-gradient-to-r from-[rgb(156,57,131)] from-20% via-[rgb(140,30,130)] via-50% to-[rgb(100,20,120)] via-70%  h-screen w-screen ${gameOver ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}`}>
        <div className='text-[75px] text-white text-center pt-20'>ROCK PAPER SCISSOR</div>
        <ScoreBoard hScore={humanScore} cScore={computerScore}/>
        <div className="h-75 w-200 bg-black -outline-offset-10 outline-3 outline-white m-20 flex items-center justify-center text-3xl text-white cursor-pointer absolute top-50 left-50" onClick={handleForceExit}>Back</div>
        <div className="flex justify-evenly mt-50">
            <ComputerBoard values={arr} doesStart={computerStart} current={currInpInd}/>
            <div className={`flex ${1} text-[50px] text-red-600 w-300 h-300 items-center text-center justify-center`}>{message}</div>
            <HumanBoard humanInput={humanInput}/>
        </div>
        <ChoiceBox handleClick={handleHumanInput} shouldDisable={computerStart}/>
    </div>
    {gameOver && <GameOver winner={winner} handleExit={handleExit} handleRestart={handleRestart}/>}
    {forceExit && <Back handleExit={handleExit} checkExit={checkExit} endGame={endGame}/>}
    </>
    )
}

export default GamePage;