const express = require('express');
const http = require("http");
const path = require('path');
const socketio = require("socket.io");
const port = 3000

const app = express();
const server = http.createServer(app)
const io = socketio(server);

io.on("connection", (socket) => {
  console.log("Connected: " + socket.id);
  socket.on("userDisconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

  socket.on("sendLocation", (data)=>{
    io.emit("recieveLocation",{
      id: socket.id,
      ...data
    })
  })
});


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.render('index')
})
server.listen(port, () => {
  console.log(`http://localhost:${port}`)
})