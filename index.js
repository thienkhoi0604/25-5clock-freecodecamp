const App = () => {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(
    new Audio("./breakTime.mp3")
  );

  const playBreakAudio = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!isPlaying) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!isPlaying) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakAudio();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playBreakAudio();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (isPlaying) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setIsPlaying(!isPlaying);
  };

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };

  return (
    <div className="center-align">
      <h1>Pomodoro Clock</h1>
      <div className="dual-container">
        <Length
          title={"break-label"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
          btnDecre={"break-decrement"}
          btnIncre={"break-increment"}
          nameLength={"break-length"}
        />
        <Length
          title={"session-label"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
          btnDecre={"session-decrement"}
          btnIncre={"session-increment"}
          nameLength={"session-length"}
        />
      </div>
      <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
      <h1 id="time-left">{formatTime(displayTime)}</h1>
      <button
        className="btn-large deep-purple lighten-2"
        onClick={controlTime}
        id="start_stop"
      >
        {isPlaying ? (
          <i className="material-icons">pause_circle_filled</i>
        ) : (
          <i className="material-icons">play_circle_filled</i>
        )}
      </button>
      <button
        className="btn-large deep-purple lighten-2"
        onClick={resetTime}
        id="reset"
      >
        <i className="material-icons">autorenew</i>
      </button>
      <audio id="beep"></audio>
    </div>
  );
};

const Length = ({
  title,
  changeTime,
  type,
  time,
  formatTime,
  btnDecre,
  btnIncre,
  nameLength,
}) => {
  return (
    <div>
      <h3 id={title}>{title}</h3>
      <div className="time-sets">
        <button
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(-60, type)}
          id={btnDecre}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h3 id={nameLength}>{formatTime(time)}</h3>
        <button
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(60, type)}
          id={btnIncre}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
