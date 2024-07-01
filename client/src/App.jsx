import React, { useState , useMemo } from 'react'
import {io} from 'socket.io-client'
import { useEffect } from 'react';
import {Container, Stack, TextField, Typography} from '@mui/material';


const App = () => {

  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [room, setRoom] = useState("");
  const [message,setMessage]=useState("");
  const [TotMessage,setTotMessage]=useState([]);

  const handleSubmit = (e)=>{
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  }
  const [Id,setId]=useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setId(socket.id);
    });

    socket.on("welcome", ()=>{
      console.log("Welcome");
    })

    socket.on("receive-message", (data) => {
      console.log(data);
      setTotMessage((TotMessage) => [...TotMessage, data]);
    });


    return () =>{
      socket.disconnect();
    }
  }, []);
  return (

    <Container maxWidth='sm'>
      <form onSubmit={handleSubmit}>
        <TextField value={message} onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          label="Message"/>
        
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <button type='submit'>send</button>

      <p>{Id}</p>
      </form>

      <Stack>
        {TotMessage.map((m,i)=>(
          <p>{m}</p>
        ))}
      </Stack>
    </Container>
  )
}

export default App
