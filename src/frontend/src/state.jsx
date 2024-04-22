import { createGlobalState } from "react-hooks-global-state";

const initialState = {
  application: "techne",
  identity: null,
  authClient: null,
  backend: null,
  backendActor: null,
  username: "",
};

export const { useGlobalState } = createGlobalState(initialState);
