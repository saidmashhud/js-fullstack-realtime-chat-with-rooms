import { useState } from 'react';
import * as io from 'socket.io-client';

import styles from './styles.module.css';

interface ISendMessageProps {
  username: string;
  room: string;
  socket: io.Socket;
}

function SendMessage({ username, room, socket }: ISendMessageProps) {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message !== '') {
      const __createdtime__ = Date.now();
      socket.emit('send_message', { username, room, message, __createdtime__ });
      setMessage('');
    }
  };

  return (
    <div className={styles.sendMessageContainer}>
      <input
        className={styles.messageInput}
        placeholder='Message...'
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button className='btn btn-primary' onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
}

export default SendMessage;
