import { createGlobalState } from "react-hooks-global-state";

const initialState = {
    application: "gramberg",
    identity: null,
    authClient: null,
    backend: null,
    backendActor: null,
    username: "",
};

export const { useGlobalState } = createGlobalState(initialState);
