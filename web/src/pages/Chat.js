import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";



function Chat() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [messages, setMessages] = useState([])
  const [infos, setInfos] = useState([])
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log('component Chat mounted!')
  },[])

  const addMessage = (newMessage) => {
    setMessages((prevMess) => {
      let newMess = [...prevMess]
      newMess.push(newMessage)
      return newMess
    })
  }

  const handleMessage = (e) => {
    e.preventDefault()
    const data = {message: e.target.message.value, username: username }
    socket.emit('chat message', data)
    addMessage(data)
    console.log(`message emit by ${data.username} : ${data.message}`)
    console.log("quand message envoyé : ",messages)
  }

  const handleConnection = (e) => {
    e.preventDefault()
    setLoggedIn(true)
    const newSocket = io("http://localhost:8000")
    setSocket(newSocket)
    newSocket.on('new message', (data) => {
      addMessage(data)
      console.log("quand message reçu : ",messages)
      console.log(`message received from ${data.username} : ${data.message}`)
    })
    newSocket.on('connection', () => {
      setInfos((prevInfo) => {
        let newInfo = [...prevInfo]
        newInfo.push("Nouvel arrivant")
        return newInfo
      })
    })
    newSocket.on('disconnection', () => {
      setInfos((prevInfo) => {
        let newInfo = [...prevInfo]
        newInfo.push("Quelqu'un est parti")
        return newInfo
      })
    })
    console.log(`user ${username} logged in`)
    return () => newSocket.disconnect();
  }

  const handleQuit = () => {
    socket.disconnect()
    setLoggedIn(false)
  }

  return (
    <div>
      {loggedIn &&
      <div id="loginContainer">
        <div id="chatContainer">
          <ul id="messages">{
            messages.map(({message, username}, id) => <li key={id}>{username} : {message}</li>)
          }</ul>
          <form id="form" onSubmit={handleMessage} action="">
            <input id="message"  autoComplete="off" /><button>Send</button>
          </form>
        </div>
        <div>
          <button onClick={handleQuit}>Quit</button>
          <ul id="info">{
            infos.map((infos, id) => <li key={id}>{infos}</li>)
          }</ul>
        </div>
      </div>
      }
      {!loggedIn &&
        <form id="chatContainer" onSubmit={handleConnection}>
          <input id="username" value={username} onChange={(e) => {setUsername(e.target.value)}} autoComplete="off" /><button>Connect</button>
        </form>
      }
    </div>
    
  );

}

export default Chat;