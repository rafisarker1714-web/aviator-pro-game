const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.url.startsWith("/next")) {
    // Predictor er secret rasta - sudhu tumi janba
    // Example: /next?key=amar-secret-123
    const url = new URL(req.url, "http://localhost");
    if (url.searchParams.get("key") === "amar-secret-123") {
      res.end(JSON.stringify({ nextCrash: crashPoint, roundId, gameState: GameState }));
    } else {
      res.end(JSON.stringify({ error: "wrong key" }));
    }
    return;
  }
  res.end("Aviator Server Online");
});

const io = new Server(server, { cors: { origin: "*" } });
let GameState = "BET";
let currentNum = "1.00";
let currentSecondNum = 0;
let time = 6;
let crashPoint = 2.5;
let history = [];
let roundId = 1;

function sendState() {
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
    socket.emit("successBet", "Bet placed!");
    socket.emit("myBetState", { betted: true, "1": { betted: true } });
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
    let r = parseFloat(currentNum) + 0.06 + Math.random() * 0.05;
    currentNum = r.toFixed(2);
    currentSecondNum = parseFloat(currentNum);
    if (parseFloat(currentNum) >= parseFloat(crashPoint)) {
      GameState = "GAMEEND";
      history.unshift({ id: roundId, name: "Round " + roundId, betAmount: parseFloat(crashPoint) });
      if (history.length > 10) history.pop();
      io.emit("finishGameHand", crashPoint);
      io.emit("history", history);
      console.log("CRASH at", crashPoint);
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server running on port " + PORT));
