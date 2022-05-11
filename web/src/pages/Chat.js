import React from 'react';
import { io } from "socket.io-client";
import axios from "axios" ;


function Chat(props) {

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.input.value);
    axios.get('http://localhost:8000')
      .then((response) => {
        // handle success
        console.log(response);
      })

    const socket = io("http://localhost:8000");
    socket.emit('chat message', e.target.input.value);
  }

  return (
    <div id="chatContainer">
      <ul id="messages"></ul>
      <form id="form" onSubmit={handleSubmit} action="">
        <input id="input" autoComplete="off" /><button>Send</button>
      </form>
    </div>
  );

}

export default Chat;