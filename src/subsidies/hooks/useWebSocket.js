// src/hooks/useWebSocket.js
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { farmer } = useAuth();

  useEffect(() => {
    if (farmer) {
      const ws = new WebSocket(`${url}?userId=${farmer.id}`);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'application_update') {
          setNotifications(prev => [...prev, data]);
        }
      };
      
      setSocket(ws);
      
      return () => ws.close();
    }
  }, [farmer, url]);

  return { socket, notifications };
};