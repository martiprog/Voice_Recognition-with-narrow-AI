var express = require("express");
var socketIo = require("socket.io");
var http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res, next) => {
    res.sendFile(__dirname + "/web/index.html");
    
  });
  app.use(express.static(__dirname + '/web/'));

const { SerialPort } = require("serialport");
const { ReadlineParser } = require('@serialport/parser-readline')
const port = new SerialPort({
  path: "COM3",
  baudRate: 9600,
}).setEncoding("utf8");


const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
  io.on("connection", function (socket) {
    console.log("new_client_conected");
    socket.emit("setup","");
    //Scan and verify port
    parser.on("data", function (data) {
      if(data.indexOf("req:") > -1){
        socket.emit("leds-status",data.substr(4,13));
      }
      else{
      socket.emit("controller_data",data);
      }
    })
    socket.on("on",function (on_data) {
      port.write("on_"+ on_data);
    })
    socket.on("off",function (off_data) {
      port.write("off_"+ off_data);
    })
    socket.on("led_state_request",function (d) {
      port.write("request");
    })

  });
  io.on('disconnect', () => {
    console.log("Disconection was made by the user");
  });

  port.on('close', function () {
    console.log('Error:  Opening COM3: File not found');
    io.emit("closed_port","Port is DISCONNECTED!\nPlease check the connection\nand open the web page again! ");
    process.exit(5);
  });
  port.on('open',function () {
    console.log("Arduino is conected sucsesfully!");
  })
  port.on('error', function(err) {
    console.log('Error: ', err.message);
    process.exit(5);
  })

  server.listen(3000, () => {
    console.log("Waiting for clients to connect...");
    console.log("Server started at localhost:3000");
  });
  