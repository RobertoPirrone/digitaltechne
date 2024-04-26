import { useParams, useLocation, useNavigate } from "react-router-dom";
import ReactJsonViewCompare from 'react-json-view-compare';

export const JsonCompare = () => {
  let react_router_location = useLocation();
    let state = react_router_location.state;
  console.log("DossierDetail params: " + JSON.stringify(react_router_location.state.oldData));
    return (
      <ReactJsonViewCompare oldData={state.oldData} newData={state.newData} />
    )
}
