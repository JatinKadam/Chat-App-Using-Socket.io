const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const router = require("./routes/router.js");
const { addUser, removeUser, getUsers, getUsersInRoom } = require("./users");
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//sv is inside io and server is hostted on local host5000
io.on("connection", (socket) => {
  console.log("We have a new connection");

  socket.on("join", ({ name, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, name, room });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    //system msg
    socket.emit("message", {
      user: "admin",
      text: `${user.name} welcome to ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined` });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUsers(socket.id); //user is added above
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback(); //to clean setMessage to empty string
  });
  socket.on("disconnect", () => {
    console.log("user Dc");
  });
});

app.use(router);

server.listen(PORT, () => {
  console.log(`sv is running on ${PORT}`);
});

// and adding an normal:
// var express = require('express');
// var app = express();

// //app.configure, app.use etc

// app.listen(1234);
// and adding an http server:

// var express = require('express');
// var http = require('http');

// var app = express();
// var server = http.createServer(app);

// //app.configure, app.use etc

// server.listen(1234);
