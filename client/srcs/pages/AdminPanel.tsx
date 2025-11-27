import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const messagesRes = await fetch('/api/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
      } else {
        alert('Failed to fetch messages. Are you an admin?');
      }

      const settingsRes = await fetch('/api/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }
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
    </div>
  );
};

export default AdminPanel;
