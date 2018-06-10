const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const indexPage = require("./routes/index");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//use the index page
app.use(indexPage);


const {apiKey} = require('./config');

let interval;
io.on("connection", socket => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      `https://api.darksky.net/forecast/${apiKey}/41.3712,73.4140`
    );
    socket.emit("FromAPI", res.data.currently.temperature);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};
server.listen(port, () => console.log(`Listening on port ${port}`));