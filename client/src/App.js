import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import MIDIInput from './components/midi-input/midi-input';

import { io } from 'socket.io-client'

function App() {

  

  const [isConnected, setIsConnected] = useState(null);
  const [note, setNote] = useState(null)
  const [channel, setChannel] = useState(null)
  const [noteValue, setNoteValue] = useState(null)
  const [inputType, setInputType] = useState(null)
  const [inputStatus, setInputStatus] = useState(null)
  const [ports, setPorts] = useState(null)
  


  

  useEffect(() => {
    const socket = io("http://192.168.1.164:4000")
    
    socket.on('connect', (message) => {
      setIsConnected(true);
      console.log(`Connected to MIDI Server`)
      setPorts(message)
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('key-pressed', (data) => {
      setPorts(data.portsActive)
      setChannel(data.channel)
      setInputType(data.type)
      setInputStatus(data.status)
      setNote(data.note)
      setNoteValue(data.value)
      console.log("Key Pressed")
    })

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('key-pressed');
    };
  }, []);

  const root = document.documentElement;
  root.style.setProperty('--value', noteValue);

  return (
    <div className="App">
      <MIDIInput />
      <header className="App-header">
        <p>{!ports ? "Loading..." : `${ports} Device(s) Found`}</p>
        <p>{note ? `Note: ${note}` : "No Note"}</p>
        <p>{channel ? `Channel: ${channel}` : "No Channel"}</p>
        <p>{noteValue ? `Value: ${noteValue}` : "No Data"}</p>
        <p>{inputType ? `Type: ${inputType}` : "No Input"}</p>
      </header>
    </div>
  );
}

export default App;
