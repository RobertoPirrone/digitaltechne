import React, { useState } from "react";
import { Route, redirect } from "react-router-dom";
import { now } from "./Utils"
// import { useGlobalHook } from '@devhammed/use-global-hook'
// import MyAxios, {check_response} from "./MyAxios";

const GuardedRoute = ({ component: Component, ...rest }) => {
    //console.log("rest",rest);

    // prop forcereload forza azzeramento stato ad ogni accesso
    // della componente (aggiunta key univoca)
    // NOTA: non si puo' usare appAlert() altrimenti
    //       a fronte dell'alert viene ricaricata completamente la pagina
    let forcereload = false;
    if (rest.forcereload === "true")
        forcereload = true;
    //console.log("forcereload",forcereload);

    // il path lo inoltriamo come prop mode alla component
    let mode =  (rest.path).substring(1);
    let slash = mode.indexOf("/");
    if(slash !== -1)
        mode = mode.substr(0,slash);

    const { userInfo, setUserInfo } = useGlobalHook('userStore');
    const [loading, setLoading] = useState(true);

    const isonow = () => new Date().toISOString();

    React.useEffect(() => {
        console.log("--- "+now()+" GuardedRoute",mode);
        //console.log("call get_userinfo");
        let url = 'get_userinfo';
    }, [setUserInfo,mode]);

    //console.log("GuardedRoute: loading:",loading,"userInfo",userInfo,"mode",mode);
    if(loading)
        return(
            <div> <p> Loading... </p> </div>
        )
    return(
        <Route {...rest} render={(rest) => (
            userInfo.username ?
                (forcereload ? (
                        <Component {...rest} mode={mode} key={isonow()} />
                    ) : (
                        <Component {...rest} mode={mode}/>
                    ))
                : <Redirect to='/login' />
        )} />
    )
}

export default GuardedRoute;
