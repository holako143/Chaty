import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [logs, setLogs] = useState([]);
  const [flairs, setFlairs] = useState([]);
  const [newFlairName, setNewFlairName] = useState('');
  const [newFlairIcon, setNewFlairIcon] = useState('');
  const [emojis, setEmojis] = useState([]);
  const [newEmojiName, setNewEmojiName] = useState('');
  const [newEmojiUrl, setNewEmojiUrl] = useState('');
  const [shortcuts, setShortcuts] = useState([]);
  const [newShortcutText, setNewShortcutText] = useState('');
  const [newShortcutFullText, setNewShortcutFullText] = useState('');
  const [filteredWords, setFilteredWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [bans, setBans] = useState([]);

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
        filteredWordsRes,
        bansRes,
      ] = await Promise.all([
        fetch('/api/messages', { headers }),
        fetch('/api/settings', { headers }),
        fetch('/api/users', { headers }),
        fetch('/api/rooms', { headers }),
        fetch('/api/logs', { headers }),
        fetch('/api/flairs', { headers }),
        fetch('/api/emojis', { headers }),
        fetch('/api/shortcuts', { headers }),
        fetch('/api/filtered-words', { headers }),
        fetch('/api/bans', { headers }),
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
      if (filteredWordsRes.ok) setFilteredWords(await filteredWordsRes.json());
      if (bansRes.ok) setBans(await bansRes.json());
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

    const handleCreateFlair = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/flairs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newFlairName, icon: newFlairIcon }),
    });
    if (res.ok) {
      const newFlair = await res.json();
      setFlairs([...flairs, newFlair]);
      setNewFlairName('');
      setNewFlairIcon('');
    }
  };

  const handleDeleteFlair = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/flairs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setFlairs(flairs.filter((flair) => flair.id !== id));
  };

    const handleCreateEmoji = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/emojis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newEmojiName, imageUrl: newEmojiUrl }),
    });
    if (res.ok) {
      const newEmoji = await res.json();
      setEmojis([...emojis, newEmoji]);
      setNewEmojiName('');
      setNewEmojiUrl('');
    }
  };

  const handleDeleteEmoji = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/emojis/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setEmojis(emojis.filter((emoji) => emoji.id !== id));
  };

  const handleCreateShortcut = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/shortcuts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shortcutText: newShortcutText, fullText: newShortcutFullText }),
    });
    if (res.ok) {
      const newShortcut = await res.json();
      setShortcuts([...shortcuts, newShortcut]);
      setNewShortcutText('');
      setNewShortcutFullText('');
    }
  };

  const handleDeleteShortcut = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/shortcuts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setShortcuts(shortcuts.filter((shortcut) => shortcut.id !== id));
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/filtered-words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ word: newWord }),
    });
    if (res.ok) {
      const newFilteredWord = await res.json();
      setFilteredWords([...filteredWords, newFilteredWord]);
      setNewWord('');
    }
  };

  const handleDeleteWord = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/filtered-words/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setFilteredWords(filteredWords.filter((word) => word.id !== id));
  };

  const handleBanUser = async (fingerprint, ipAddress) => {
    const reason = prompt('Enter reason for ban:');
    if (!reason) return;

    const token = localStorage.getItem('token');
    const res = await fetch('/api/bans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fingerprint, ipAddress, reason }),
    });
    if (res.ok) {
      const newBan = await res.json();
      setBans([...bans, newBan]);
    }
  };

  const handleLiftBan = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/bans/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setBans(bans.filter((ban) => ban.id !== id));
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
      <form onSubmit={handleCreateFlair}>
        <input
          type="text"
          value={newFlairName}
          onChange={(e) => setNewFlairName(e.target.value)}
          placeholder="Flair Name"
        />
        <input
          type="text"
          value={newFlairIcon}
          onChange={(e) => setNewFlairIcon(e.target.value)}
          placeholder="Flair Icon URL or Emoji"
        />
        <button type="submit">Create Flair</button>
      </form>
      <ul>
        {flairs.map((flair) => (
          <li key={flair.id}>
            {flair.icon} {flair.name}
            <button onClick={() => handleDeleteFlair(flair.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Custom Emojis</h2>
        <form onSubmit={handleCreateEmoji}>
        <input
          type="text"
          value={newEmojiName}
          onChange={(e) => setNewEmojiName(e.target.value)}
          placeholder="Emoji Name"
        />
        <input
          type="text"
          value={newEmojiUrl}
          onChange={(e) => setNewEmojiUrl(e.target.value)}
          placeholder="Emoji Image URL"
        />
        <button type="submit">Create Emoji</button>
      </form>
      <ul>
        {emojis.map((emoji) => (
          <li key={emoji.id}>
            <img src={emoji.imageUrl} alt={emoji.name} style={{width: '20px', verticalAlign: 'middle'}} /> {emoji.name}
            <button onClick={() => handleDeleteEmoji(emoji.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Shortcuts</h2>
      <form onSubmit={handleCreateShortcut}>
        <input
          type="text"
          value={newShortcutText}
          onChange={(e) => setNewShortcutText(e.target.value)}
          placeholder="Shortcut Text (e.g., :shrug:)"
        />
        <input
          type="text"
          value={newShortcutFullText}
          onChange={(e) => setNewShortcutFullText(e.target.value)}
          placeholder="Full Text"
        />
        <button type="submit">Create Shortcut</button>
      </form>
      <ul>
        {shortcuts.map((shortcut) => (
          <li key={shortcut.id}>
            {shortcut.shortcutText} -> {shortcut.fullText}
            <button onClick={() => handleDeleteShortcut(shortcut.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Filtered Words</h2>
      <form onSubmit={handleAddWord}>
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="New filtered word"
        />
        <button type="submit">Add Word</button>
      </form>
      <ul>
        {filteredWords.map((word) => (
          <li key={word.id}>
            {word.word}
            <button onClick={() => handleDeleteWord(word.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Bans</h2>
      <table>
        <thead>
          <tr>
            <th>Fingerprint</th>
            <th>IP Address</th>
            <th>Reason</th>
            <th>Expires At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bans.map((ban) => (
            <tr key={ban.id}>
              <td>{ban.fingerprint}</td>
              <td>{ban.ipAddress}</td>
              <td>{ban.reason}</td>
              <td>{ban.expiresAt ? new Date(ban.expiresAt).toLocaleString() : 'Permanent'}</td>
              <td>
                <button onClick={() => handleLiftBan(ban.id)}>Lift Ban</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
