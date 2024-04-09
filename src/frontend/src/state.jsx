import { createGlobalState } from 'react-hooks-global-state';

export const { useGlobalState } = createGlobalState({
  application: 'techne',
  agent: null,
  identity: null,
  count: 0,
    username: 'donald duck',
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
});
