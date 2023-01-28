import { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import * as io from 'socket.io-client';

import styles from './styles.module.css';

interface IHomeProps {
  username: string;
  room: string;
  setUsername: Dispatch<SetStateAction<string>>;
  setRoom: Dispatch<SetStateAction<string>>;
  socket: io.Socket;
}

function Home({ username, room, socket, setUsername, setRoom }: IHomeProps) {
  const navigate = useNavigate();

  const handleChangeUsername: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setUsername(event.target.value);
  };

  const handleChangeRoom: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setRoom(event.target.value);
  };

  const joinRoom = () => {
    if (username.trim() !== '' && room !== '') {
      socket.emit('join_room', { username, room });
    }

    navigate('/chat', { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`<>DevRooms</>`}</h1>
        <input
          className={styles.input}
          placeholder='Username...'
          value={username}
          onChange={handleChangeUsername}
        />

        <select
          className={styles.input}
          value={room}
          onChange={handleChangeRoom}
        >
          <option>-- Select Room --</option>
          <option value='javascript'>JavaScript</option>
          <option value='node'>Node</option>
          <option value='express'>Express</option>
          <option value='react'>React</option>
        </select>

        <button
          className='btn btn-secondary'
          style={{ width: '100%' }}
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}

export default Home;
