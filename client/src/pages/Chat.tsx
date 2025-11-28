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
  const [flairs, setFlairs] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [roomsRes, flairsRes, emojisRes, shortcutsRes] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/flairs'),
        fetch('/api/emojis'),
        fetch('/api/shortcuts'),
      ]);

      const roomsData = await roomsRes.json();
      setRooms(roomsData);
      if (roomsData.length > 0) {
        setCurrentRoom(roomsData[0]);
        socket.emit('join room', roomsData[0].id);
      }

      setFlairs(await flairsRes.json());
      setEmojis(await emojisRes.json());
      setShortcuts(await shortcutsRes.json());
    };
    fetchData();

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
    let messageText = input;
    shortcuts.forEach((shortcut) => {
      messageText = messageText.replace(new RegExp(shortcut.shortcutText, 'g'), shortcut.fullText);
    });

    if (messageText.trim() && user && currentRoom) {
      socket.emit('chat message', { userId: user.id, text: messageText, roomId: currentRoom.id });
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
              <span>{msg.user?.flair?.icon}</span>
              <strong>{msg.user?.username || 'User'}: </strong>
              {msg.text}
            </li>
          ))}
        </ul>
        <div>
          {emojis.map((emoji) => (
            <img
              key={emoji.id}
              src={emoji.imageUrl}
              alt={emoji.name}
              onClick={() => setInput(input + emoji.name)}
              style={{ width: '20px', cursor: 'pointer', margin: '2px' }}
            />
          ))}
        </div>
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
