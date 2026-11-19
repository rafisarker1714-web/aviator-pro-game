const { Server } = require("socket.io");
const io = new Server(5000, { cors: { origin: "*" } });
let GameState = "BET";
let currentNum = "1.00";
let currentSecondNum = 0;
let time = 6;
let crashPoint = 2.5;
let history = [];
let roundId = 1;
function sendState(){
  io.emit("gameState", { GameState, currentNum: String(currentNum), currentSecondNum, time });
}
io.on("connection", (socket) => {
  console.log("User connected");
  socket.emit("getBetLimits", { max: 10000, min: 10 });
  socket.emit("history", history);
  socket.emit("myInfo", { name: "Demo Player", balance: 10000 });
  sendState();
  socket.on("bet", (data) => {
    console.log("Bet:", data);
    socket.emit("success", "Bet placed!");
    socket.emit("myBetState", { "0": { betted: true }, "1": { betted: true } });
  });
  socket.on("cashOut", (data) => {
    console.log("CashOut:", data);
    socket.emit("success", "Cashed out at " + currentNum + "x");
  });
  socket.on("disconnect", () => console.log("User disconnected"));
});
setInterval(() => {
  if (GameState === "BET") {
    time--;
    currentSecondNum = time;
    if (time <= 0) {
      GameState = "PLAYING";
      crashPoint = (Math.random() * 8 + 1.2).toFixed(2);
      currentNum = "1.00";
      currentSecondNum = 0;
      console.log("Round", roundId, "FLYING, crash at", crashPoint);
    }
  } else if (GameState === "PLAYING") {
    let v = parseFloat(currentNum) + 0.06 + Math.random() * 0.05;
    currentNum = v.toFixed(2);
    currentSecondNum = parseFloat(currentNum);
    if (parseFloat(currentNum) >= parseFloat(crashPoint)) {
      GameState = "GAMEEND";
      time = 3;
      history.unshift({ id: roundId, name: "Round " + roundId, betAmount: parseFloat(crashPoint) });
      if (history.length > 10) history.pop();
      io.emit("history", history);
      io.emit("finishGameHand", { crashPoint });
      console.log("CRASHED at", crashPoint);
      roundId++;
    }
  } else if (GameState === "GAMEEND") {
    time--;
    if (time <= 0) {
      GameState = "BET";
      time = 6;
      currentNum = "1.00";
      currentSecondNum = 6;
    }
  }
  sendState();
}, 1000);
console.log("Demo server running on port 5000");
