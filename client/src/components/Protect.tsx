import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";

interface ProtectProps {
  compo: ReactNode;
}

const Protect: React.FC<ProtectProps> = ({ compo }) => {
  const {user} = useSelector((state: RootState) => state.auth);
console.log("userrrr", user);

  return user ? <>{compo}</> : <Navigate to="/login" />;
};

export default Protect;
