import { createGlobalState } from "react-hooks-global-state";

const initialState = {
  application: "techne",
  identity: null,
  backend: null,
  username: "",
};
export const { useGlobalState } = createGlobalState(initialState);
