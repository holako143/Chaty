import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [logs, setLogs] = useState([]);
  const [flairs, setFlairs] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [
        messagesRes,
        settingsRes,
        usersRes,
        roomsRes,
        logsRes,
        flairsRes,
        emojisRes,
        shortcutsRes,
      ] = await Promise.all([
        fetch('/api/messages', { headers }),
        fetch('/api/settings', { headers }),
        fetch('/api/users', { headers }),
        fetch('/api/rooms', { headers }),
        fetch('/api/logs', { headers }),
        fetch('/api/flairs', { headers }),
        fetch('/api/emojis', { headers }),
        fetch('/api/shortcuts', { headers }),
      ]);

      if (messagesRes.ok) setMessages(await messagesRes.json());
      else alert('Failed to fetch messages. Are you an admin?');

      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (roomsRes.ok) setRooms(await roomsRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
      if (flairsRes.ok) setFlairs(await flairsRes.json());
      if (emojisRes.ok) setEmojis(await emojisRes.json());
      if (shortcutsRes.ok) setShortcuts(await shortcutsRes.json());
    };
    fetchData();
  }, []);

  const handleSettingChange = async (key, value) => {
    const token = localStorage.getItem('token');
    await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ key, value }),
    });
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newRoomName }),
    });
    if (res.ok) {
      const newRoom = await res.json();
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
    }
  };

  const handleDeleteRoom = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/rooms/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRooms(rooms.filter((room) => room.id !== id));
  };

  const handleAssignFlair = async (userId, flairId) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/users/${userId}/flair`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ flairId }),
    });
  };

  return (
    <div>
      <h2>Admin Panel - All Messages</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Message</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id}>
              <td>{msg.user.username}</td>
              <td>{msg.text}</td>
              <td>{new Date(msg.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Settings</h2>
      {settings.map((setting) => (
        <div key={setting.id}>
          <label>{setting.description}</label>
          <input
            type="text"
            defaultValue={setting.value}
            onBlur={(e) => handleSettingChange(setting.key, e.target.value)}
          />
        </div>
      ))}
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <select onChange={(e) => handleAssignFlair(user.id, e.target.value)}>
                  <option value="">No Flair</option>
                  {flairs.map((flair) => (
                    <option key={flair.id} value={flair.id} selected={user.flairId === flair.id}>
                      {flair.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Rooms</h2>
      <form onSubmit={handleCreateRoom}>
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="New room name"
        />
        <button type="submit">Create Room</button>
      </form>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name}
            <button onClick={() => handleDeleteRoom(room.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Flairs</h2>
      {/* Add Flair management UI here */}
      <h2>Custom Emojis</h2>
      {/* Add Emoji management UI here */}
      <h2>Shortcuts</h2>
      {/* Add Shortcut management UI here */}
      <h2>Logs</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.user.username}</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
