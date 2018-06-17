const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dweetClient = require('node-dweetio');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');

const dweetio = new dweetClient();
const dweetThing = 'node-temperature-monitor';
const SERVER_PORT = 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'index.html');
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Resource not found'
  });
});

io.on('connection', (socket) => {
  console.log('Connection has been established with browser.');
  socket.on('disconnect', () => {
    console.log('Browser client disconnected from the connection.');
  });
});

dweetio.listen_for(dweetThing, (dweet) => {
  const data = {
    sensorData: dweet.content,
    time: moment().format('HH:mm:ss')
  };
  io.emit('sensor-data', data);
});

http.listen(process.env.PORT || SERVER_PORT, () => {
  console.log(`Server started on the http://localhost:${SERVER_PORT}`);
});