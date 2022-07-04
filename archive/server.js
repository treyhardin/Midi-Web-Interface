const express = require("express");
const cors = require('cors');
const midi = require('midi');
const bodyParser = require('body-parser')


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const PORT = process.env.PORT || 3001;
const inputFrequency = 1000;


// Set up a new input.
const input = new midi.Input();

// Count the available input ports.
let portCount = input.getPortCount();

// Get the name of a specified input port.
let firstPort = input.getPortName(0);
// console.log(firstPort)

let keyPressed = false;
let currentData = null;

let channelCodes = {
  noteOff: [128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143],
  noteOn: [144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159],
  aftertouchOn: [160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175],
  controlChange: [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191]
}



// Configure a callback.
input.on('message', (deltaTime, message) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  // res.json({ message: "HELLO" });

  let statusCode = message[0];
  let currentNote = message[1];
  let currentValue = message[2];
  let currentChannel;
  let currentStatus;
  let currentType;

  if (channelCodes.noteOn.includes(statusCode)) {
    currentStatus = true;
    currentType = "Note";
    currentChannel = channelCodes.noteOn.indexOf(statusCode) + 1
  } 
  else if (channelCodes.noteOff.includes(statusCode)) {
    currentStatus = false;
    currentType = "Note";
    currentChannel = channelCodes.noteOff.indexOf(statusCode) + 1
  }
  else if (channelCodes.aftertouchOn.includes(statusCode)) {
    currentStatus = true;
    currentType = "Aftertouch";
    currentChannel = channelCodes.aftertouchOn.indexOf(statusCode) + 1
  }
  else if (channelCodes.controlChange.includes(statusCode)) {
    currentStatus = true;
    currentType = "Control Knob";
    currentChannel = channelCodes.controlChange.indexOf(statusCode) + 1
  }

  console.log(`Channel: ${currentChannel}, Type: ${currentType}, Status: ${currentStatus}`)

  currentData = {
    channel: currentChannel,
    type: currentType,
    status: currentStatus,
    note: currentNote,
    value: currentValue
  }
  // console.log(`m: ${message} d: ${deltaTime}`);
});

setInterval(() => {

}, inputFrequency)

// Open the first available input port.
input.openPort(1);

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
input.ignoreTypes(false, false, false);

// ... receive MIDI messages ...

// Close the port when done.
// setTimeout(function() {
//   input.closePort();
// }, 100000);



// console.log(app)

app.get("/api", (req, res) => {
  res.json({ 
    devices: portCount,
    message: currentData
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});