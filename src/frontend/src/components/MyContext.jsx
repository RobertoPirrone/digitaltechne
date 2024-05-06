// https://dev.to/hey_yogini/usecontext-for-better-state-management-51hi

import { createContext, useState } from 'react';

//create a context, with createContext api
export const myContext = createContext();

const MyContext = (props) => {
        // this state will be shared with all components 
    const [whoami, setWhoami] = useState("");
    const [backendActor, setBackendActor] = useState(null);
    const [assetPfx, setAssetPfx] = useState();

    return (
                // this is the provider providing state
        <myContext.Provider value={[
            whoami, setWhoami,
            backendActor, setBackendActor,
            assetPfx, setAssetPfx
        ]}>
            {props.children}
        </myContext.Provider>
    );
};

export default MyContext;
