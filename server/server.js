const io = require('socket.io')(4000, {
  cors: {
    origin: ['http://192.168.1.164:3000']
  }
})

console.log(io)

io.on('connection', socket => {
  console.log(socket.id)

  // Receive Custom Message
  socket.on('select-mode', message => {
    console.log(message)
  })

  // Send Custom Message
  // io.emit('key-pressed', "KEY")

  socket.on('disconnect', reason => {
    console.log('Disconnected from client')
  })
  
})

let channelCodes = {
  noteOff: [128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143],
  noteOn: [144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159],
  aftertouchOn: [160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175],
  controlChange: [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191]
}





const midi = require('midi');

// Set up a new input.
const input = new midi.Input();

// Count the available input ports.
input.getPortCount();

// Get the name of a specified input port.
// input.getPortName(0);

// Configure a callback.
input.on('message', (deltaTime, message) => {

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

  let midiEvent = {
    portsActive: input.getPortCount(),
    channel: currentChannel,
    type: currentType,
    status: currentStatus,
    note: currentNote,
    value: currentValue
  }


  io.emit('key-pressed', midiEvent)
});

// Open the first available input port.
input.openPort(1);

input.ignoreTypes(false, false, false);
