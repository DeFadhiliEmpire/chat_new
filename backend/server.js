const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const { addMessage } = require("./controllers/messageControllers");

//dotenv in our server.js
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Routes in server file
app.use("/api/messages", require("./routes/messageRoutes"));
//root route
app.get("/", (req, res) => {
  res.send({
    message: "CHAT API Server",
    version: "2.0.0",
    endpoints: {
      getMessages: "GET /api/messages",
      createMessages: "POST /api/messages",
      deleteMessages: "DELETE /api/messages",
      tetsClient: "GET /index.html",
    },
  });
});

//socket connection in backend
io.on("connection", (socket) => {
  console.log("User Socket id is:", socket.id);
  //connect functionality by server
  socket.emit("message", {
    user: "System",
    text: "Welcome to the chat!",
    timestamp: new Date().toISOString(),
  });

  socket.broadcast.emit("message", {
    user: "System",
    text: "A new user joined the chat",
    timestamp: new Date().toISOString(),
  });

  //disconnect functionallity by server
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    io.emit("message", {
      user: "System",
      text: "A user left the chat",
      timestamp: new Date().toISOString(),
    });
  });

  //typing functionallity in backend
  socket.on("typing", (data) => {
    socket.broadcast.emit("userTyping", data);
  });
  //send and receive messages
  socket.on("sendMessage", (data) => {
    const newMessage = addMessage(data);

    io.emit("receiveMessage", newMessage);
  });
});

//Error handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "someting went wrong",
    error: err.message,
  });
});

//Test route
app.get("/test", (req, res) => {
  res.json({
    message: "Serever is runnin perfectly",
    timestamp: new Date(),
    status: "success",
  });
});

server.listen(PORT, () => {
  console.log(`server running on port :${PORT}`);
});
