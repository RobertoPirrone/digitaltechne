import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { useGlobalState } from './state';

export const IILogin = () => {
    const navigate = useNavigate();
    const IIcanisterId = process.env.CANISTER_ID_INTERNET_IDENTITY;
    const [identity, setIdentity] = useGlobalState('identity');
    const [agent, setAgent] = useGlobalState('agent');

    async function InternetIdentityLogin() {
        let authClient = await AuthClient.create();
        await new Promise((resolve) => {
            authClient.login({
                identityProvider:
                    process.env.DFX_NETWORK === "ic"
                        ? "https://identity.ic0.app"
                        : `http://${IIcanisterId}.localhost:4943`
            });
            const IIidentity = authClient.getIdentity();
            console.log(IIidentity);
            setIdentity(IIidentity);
            const IIprincipal = authClient.getIdentity().getPrincipal();
            console.log("principal: ", IIprincipal);

            const IIagent = new HttpAgent({ identity });
            console.log(JSON.stringify(IIagent));
            setAgent(IIagent);
            navigate("/dossier");
        });
    }

    return ( 
        <div className="w-1/2 mb-4"> 
            <button onClick={async () => await InternetIdentityLogin()} className="btn btn-primary">Login</button> 
        </div>);
};
