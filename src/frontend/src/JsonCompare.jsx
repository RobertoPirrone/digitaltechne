import ReactJsonViewCompare from "react-json-view-compare";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/**
 * confronto tra stringhe DNA, recuparate da react_router_location.state
 */
export const JsonCompare = () => {
    const react_router_location = useLocation();
    const state = react_router_location.state;
    console.log(`JsonCompare params: ${JSON.stringify(react_router_location.state.oldData)}`);
    return <ReactJsonViewCompare oldData={state.oldData} newData={state.newData} />;
};
