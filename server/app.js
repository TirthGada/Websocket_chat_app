const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 3000;
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','POST'],
        credentials:true,
    }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(socket.id);
  // socket.emit("welcome","connected with id")

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("receive-message", message);
  });


  socket.on("disconnect",()=>{
    console.log("Mera User disconnected")
  })
});


server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
