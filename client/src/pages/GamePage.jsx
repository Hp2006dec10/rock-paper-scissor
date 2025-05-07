import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import api from "./axios";

const ScoreBoard = ({hScore, cScore}) => {
    return (
        <div className="w-[80%] py-[2.5%] mx-auto md:py-[0.5%] px-[2%] -outline-offset-7 outline-3 outline-dotted bg-black text-white ">        
            <div className="flex justify-evenly py-[1%] text-xl">
                <div className="text-center">
                <p className="text-xl lg:text-2xl">Computer</p>
                <p className="text-2xl lg:text-4xl">{cScore}</p>
                </div>
                <div className="text-[30px] md:text-[50px] my-auto hidden md:block">SCORE </div>
                <div className="text-center">
                <p className="text-xl lg:text-2xl">Player</p>
                <p className="text-2xl lg:text-4xl">{hScore}</p>
                </div>
            </div>
        </div>
    )
}

const HumanBoard = ({humanInput}) => {
    return (
        <div className="size-100 md:size-180 bg-white">
            {humanInput && <img src={`images/${humanInput}.jpg`} className="h-[100%] w-[100%]"/>}
        </div>
    )
}

const ComputerBoard = ({values,doesStart, current}) => {    
    return (
        <div className="size-100 md:size-180 bg-white">
            {doesStart && <img src={`images/${values[current]}.jpg`} className="h-[100%] w-[100%]"/>}
        </div>
    )
}

const ChoiceBox = ({handleClick, shouldDisable}) => {
    return (
        <div className={`flex mx-auto flex-col gap-10 items-center md:flex-row justify-evenly ${shouldDisable ? "pointer-events-none opacity-50 grayscale cursor-not-allowed":""} w-[100%] md:w-[65%] lg:w-[55%]`}>
            <div className="px-[10%] md:py-[1%] bg-black flex h-fit w-[40%] md:w-[20%] rounded-full text-2xl lg:text-3xl justify-center items-center text-white cursor-pointer"  onClick={()=>handleClick(0)}>Rock</div>
            <div className="px-[10%] md:py-[1%] bg-black flex h-fit w-[40%] md:w-[20%] rounded-full text-2xl lg:text-3xl justify-center items-center text-white cursor-pointer" onClick={()=>handleClick(1)}>Paper</div>
            <div className="px-[10%] md:py-[1%] bg-black flex h-fit w-[40%] md:w-[20%] rounded-full text-2xl lg:text-3xl justify-center items-center text-white cursor-pointer" onClick={()=>handleClick(2)}>Scissor</div>
        </div>
    )
}

const GameOver = ({winner, handleExit, handleRestart}) => {
    return (
        <div className="p-[4%] md:p-[2%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[rgb(180,60,150)] from-20% via-[rgb(140,30,130)] via-50% to-[rgb(100,20,120)] via-90% ">
            <div className=" w-[100%] justify-self-center text-xl md:text-2xl lg:text-4xl text-white mb-[10%]">{winner} won</div>
            <div className="flex justify-between gap-[10%] w-[100%]">
                <div className="text-center h-fit w-[70%] p-[2.5%] text-xl md:text-2xl border-box bg-white cursor-pointer shadow-xl" onClick={handleRestart}>Restart</div>
                <div className="text-center h-fit w-[70%] p-[2.5%] text-xl md:text-2xl border-box bg-white cursor-pointer shadow-xl" onClick={handleExit}>Exit</div>
            </div>
        </div>
    )
}

const Back = ({handleExit, checkExit, endGame}) => {
    return (
        <div className="p-[4%] md:p-[2%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[rgb(180,60,150)] from-20% via-[rgb(140,30,130)] via-50% to-[rgb(100,20,120)] via-90% ">
            <div className=" w-[100%] text-center text-xl md:text-2xl lg:text-4xl text-white mb-[10%]">Are you sure want to Exit?</div>
            <div className="flex justify-between gap-[10%] w-[100%]">
                <div className="text-center h-fit w-[70%] p-[2.5%] text-xl md:text-2xl border-box bg-white cursor-pointer shadow-xl" onClick={handleExit}>Yes</div>
                <div className="text-center h-fit w-[70%] p-[2.5%] text-xl md:text-2xl border-box bg-white cursor-pointer shadow-xl" onClick={()=> {checkExit(false);endGame(false)}}>No</div>
            </div>
        </div>
    )   
}

const MessageBox = ({message}) => {
    return (
        <div className="text-center text-xl md:text-2xl lg:text-3xl ">
            <div className="text-[rgb(141,255,179)]">First to 10 points will win</div>
            <div className=" text-[rgb(254,245,151)]">{message}</div>
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

    useEffect(()=>{
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
        setMessage("Waiting for computer input...");
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
   <div className={`flex flex-col w-[100%] justify-evenly bg-gradient-to-r from-[rgb(15,36,225)] from-20% via-[rgb(20,64,147)] via-50% to-[rgb(21,101,182)] to-70%  h-screen ${gameOver ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}`}>
   <div className='text-[30px] md:text-[50px] text-white text-center '>ROCK PAPER SCISSOR</div>
        <ScoreBoard hScore={humanScore} cScore={computerScore}/>
        <MessageBox message={message}/>
        <div className="flex justify-evenly h-fit w-[100%] py-[1%]">
            <ComputerBoard values={arr} doesStart={computerStart} current={currInpInd}/>
            <HumanBoard humanInput={humanInput}/>
        </div>
        <ChoiceBox handleClick={handleHumanInput} shouldDisable={computerStart}/>
        <div className="w-fit h-fit px-[5%] py-[3%] md:py-[1%] bg-black -outline-offset-10 outline-3 outline-white text-center text-xl md:text-3xl text-white cursor-pointer relative left-[67.5%] md:left-[75%] lg:left-[80%] my-[2%]" onClick={handleForceExit}>Back</div>
    </div>
    {gameOver && <GameOver winner={winner} handleExit={handleExit} handleRestart={handleRestart}/>}
    {forceExit && <Back handleExit={handleExit} checkExit={checkExit} endGame={endGame}/>}
    </>
    )
}

export default GamePage;