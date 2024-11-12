import React, { useState } from "react";
import { Route, redirect } from "react-router-dom";
import { GlobalContext } from "./Global";

const GuardedRoute = ({ component: Component, ...rest }) => {
  //console.log("rest",rest);
  const userName = useContext(GlobalContext).userName;

  // prop forcereload forza azzeramento stato ad ogni accesso
  // della componente (aggiunta key univoca)
  // NOTA: non si puo' usare appAlert() altrimenti
  //       a fronte dell'alert viene ricaricata completamente la pagina
  let forcereload = false;
  if (rest.forcereload === "true") forcereload = true;
  //console.log("forcereload",forcereload);

  // il path lo inoltriamo come prop mode alla component
  let mode = rest.path.substring(1);
  let slash = mode.indexOf("/");
  if (slash !== -1) mode = mode.substr(0, slash);

  const [loading, setLoading] = useState(true);

  const isonow = () => new Date().toISOString();

  React.useEffect(() => {
    console.log("--- " + isonow() + " GuardedRoute", mode);
    //console.log("call get_userinfo");
    let url = "get_userinfo";
  }, [ mode]);

  if (loading)
    return (
      <div>
        {" "}
        <p> Loading... </p>{" "}
      </div>
    );
  return (
    <Route
      {...rest}
      render={(rest) =>
        userName ? forcereload ? <Component {...rest} mode={mode} key={isonow()} /> : <Component {...rest} mode={mode} /> : <Redirect to="/login" />
      }
    />
  );
};

export default GuardedRoute;
