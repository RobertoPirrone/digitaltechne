import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./use-auth-client";

export const Logout = () => {
  const { backendActor, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    logout();
    navigate("/login");
  })
};
