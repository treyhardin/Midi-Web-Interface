import logo from './logo.svg';
import './App.css';
import React from 'react'
import MIDIInput from './components/midi-input/midi-input';

function App() {
  const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  

  React.useEffect(() => {
    setInterval(() => {
      fetch("http://192.168.1.164:3001/api")
        .then((res) => {
          if (res.ok) {
            return res.json()
          } else {
            return console.log("Fetch Error")
          }
          
        })
        .then((data) => setData(data));
      // console.log(data)
    }, 10)
    
  }, []);

  // requestAnimationFrame(() => {
  //   let i = 0
  //   console.log(i)
  //   setData(i)
  //   i++
  // })

  // var interval = setInterval(() => {
  //   fetch("http://192.168.1.164:3001/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // },100);

  return (
    <div className="App">
      <MIDIInput />
      <header className="App-header">
        <p>{!data ? "Loading..." : `${data.devices} Device(s) Found`}</p>
        <p>{data ? `Note: ${data.message.note}` : "No Note"}</p>
        <p>{data ? `Channel: ${data.message.channel}` : "No Channel"}</p>
        <p>{data ? `Value: ${data.message.value}` : "No Data"}</p>
      </header>
    </div>
  );
}

export default App;
