import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as io from 'socket.io-client';

import MessagesReceived from './messages';
import SendMessage from './send-message';
import RoomAndUsersColumn from './room-and-users';

import styles from './styles.module.css';

interface IChatProps {
  socket: io.Socket;
  username: string;
  room: string;
}

function Chat({ socket, username, room }: IChatProps) {
  const navigate = useNavigate();

  const goHome = useCallback(
    () => navigate('/', { replace: true }),
    [navigate]
  );

  useEffect(() => {
    if (!username || !room) {
      goHome();
    }

    socket.on('disconnect', () => goHome());
  }, [username, room, navigate, socket, goHome]);

  return (
    <div className={styles.chatContainer}>
      <RoomAndUsersColumn socket={socket} username={username} room={room} />

      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
}

export default Chat;
