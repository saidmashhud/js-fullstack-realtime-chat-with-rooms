import { useState, useEffect, useRef } from 'react';
import * as io from 'socket.io-client';

import { IMessage } from '../../types';
import styles from './styles.module.css';

interface IMessagesProps {
  socket: io.Socket;
}

function Messages({ socket }: IMessagesProps) {
  const [messagesRecieved, setMessagesReceived] = useState<IMessage[]>([]);
  const messagesColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  useEffect(() => {
    socket.on('last_100_messages', (last100Messages) => {
      console.log('Last 100 messages:', JSON.parse(last100Messages));
      last100Messages = JSON.parse(last100Messages);
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => {
      socket.off('last_100_messages');
    };
  }, [socket]);

  useEffect(() => {
    if (messagesColumnRef.current) {
      messagesColumnRef.current.scrollTop =
        messagesColumnRef.current.scrollHeight;
    }
  }, [messagesRecieved]);

  function sortMessagesByDate(messages: IMessage[]) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  function formatDateFromTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className={styles.messagesColumn} ref={messagesColumnRef}>
      {messagesRecieved.map((msg, i) => (
        <div className={styles.message} key={i}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
}

export default Messages;
