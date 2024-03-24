import { User } from "@auth0/auth0-react";
import ElevatorOverview from "./ElevatorOverview";
import { Route, Routes } from "react-router-dom";
import ElevatorByState from "./ElevatorByState";
import Header from "../ui/Header";
import ElevatorById from "./ElevatorById";

type Props = {
  user: User;
  logout: () => Promise<void>;
};

export default function Home({ user, logout }: Props) {
  return (
    <div className="pb-10 sm:p-8 p-4">
      <Header username={user.name} logout={logout} />
      <Routes>
        <Route path="/" element={<ElevatorOverview/>} />
        <Route path="/state/:state" element={<ElevatorByState />} />
        <Route path="/elevator/:id" element={<ElevatorById />} />
      </Routes>
    </div>
  );
}
