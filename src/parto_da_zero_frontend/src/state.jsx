import { createGlobalState } from 'react-hooks-global-state';

export const { useGlobalState } = createGlobalState({
  application: 'techne',
  count: 0,
    username: 'donald duck',
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
});
