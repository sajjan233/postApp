/**
 * Socket.io Context
 * Provides real-time Socket.io connection for the entire app
 * Listens for new posts and updates the UI in real-time
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, APP_CONFIG } from '../config/constants';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newPost, setNewPost] = useState(null);

  useEffect(() => {
    // Initialize Socket.io connection
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: APP_CONFIG.SOCKET_RECONNECT_DELAY,
      reconnectionAttempts: APP_CONFIG.SOCKET_RECONNECT_ATTEMPTS,
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('✅ Connected to Socket.io server');
      setIsConnected(true);
      
      // Join public room for receiving broadcasts
      socketInstance.emit('join-public');
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.io server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Listen for new posts from admin
    socketInstance.on('newPost', (postData) => {
      console.log('📢 New post received:', postData);
      setNewPost(postData);
      
      // Clear the new post notification after 5 seconds
      setTimeout(() => {
        setNewPost(null);
      }, 5000);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.close();
    };
  }, []);

  const value = {
    socket,
    isConnected,
    newPost,
    clearNewPost: () => setNewPost(null),
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

