import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { useGlobalState } from './state';
import { backend } from "../../declarations/backend";

export const IILogin = () => {
    const navigate = useNavigate();
    const IIcanisterId = process.env.CANISTER_ID_INTERNET_IDENTITY;
    const [username, setUsername] = useGlobalState('username');

    async function InternetIdentityLogin() {
        let authClient = await AuthClient.create();
        await new Promise((resolve) => {
            authClient.login({
                identityProvider:
                    process.env.DFX_NETWORK === "ic"
                        ? "https://identity.ic0.app"
                        : `http://${IIcanisterId}.localhost:4943`
            });
            if (false) {
            const IIidentity = authClient.getIdentity();
            console.log(IIidentity);
            setIdentity(IIidentity);
            const IIprincipal = authClient.getIdentity().getPrincipal();
            console.log("principal: ", IIprincipal);

            const IIagent = new HttpAgent({ identity });
            console.log(JSON.stringify(IIagent));
            setAgent(IIagent);
            }
            backend.whoami().then((Ok_data) =>  {
                console.log("whoami returns: ",JSON.stringify(Ok_data));
                setUsername(Ok_data);
            });
            navigate("/dossier");
        });
    }

    return ( 
        <div className="w-1/2 mb-4"> 
            <button onClick={async () => await InternetIdentityLogin()} className="btn btn-primary">Login</button> 
        </div>);
};
