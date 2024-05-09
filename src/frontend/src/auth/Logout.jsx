import { useNavigate } from "react-router-dom";
import { useAuth } from "./use-auth-client";

export const Logout = async () => {
  const navigate = useNavigate();
  const { backendActor, logout } = useAuth();
    logout();
    navigate("/login");
};
