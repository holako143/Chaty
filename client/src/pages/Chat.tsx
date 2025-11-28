import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      setRooms(data);
      if (data.length > 0) {
        setCurrentRoom(data[0]);
        socket.emit('join room', data[0].id);
      }
    };
    fetchRooms();

    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('online users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('chat message');
      socket.off('online users');
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('token', data.token);
      socket.emit('user joined', data.user);
    } else {
      alert(data.error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      socket.emit('user joined', data.user);
    } else {
      alert(data.error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && user && currentRoom) {
      socket.emit('chat message', { userId: user.id, text: input, roomId: currentRoom.id });
      setInput('');
    }
  };

  const handleRoomChange = (room) => {
    socket.emit('leave room', currentRoom.id);
    setCurrentRoom(room);
    socket.emit('join room', room.id);
    setMessages([]); // Clear messages when changing rooms
  };

  if (!user) {
    return (
      <div>
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Register</button>
        </form>
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2>Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room.id} onClick={() => handleRoomChange(room)}>
              {room.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Online Users</h2>
        <ul>
          {onlineUsers.map((user, index) => (
            <li key={index}>{user.username}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Chat - {currentRoom?.name}</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.user?.username || 'User'}: </strong>
              {msg.text}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
