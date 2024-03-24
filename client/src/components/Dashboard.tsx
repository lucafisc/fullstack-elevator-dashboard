import { GetTokenSilentlyOptions, User } from "@auth0/auth0-react";
import StateOverview from "./Overview";
import { Route, Routes } from "react-router-dom";
import StateList from "./StateList";
import Header from "./Header";
import ElevatorDetail from "./ElevatorDetail";

type Props = {
  user: User;
  logout: () => Promise<void>;
  getToken: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>;
};

export default function Dashboard({ user, logout, getToken }: Props) {
  return (
    <div className="pb-10 sm:p-8 p-4">
      <Header username={user.name} logout={logout} />
      <Routes>
        <Route path="/" element={<StateOverview getToken={getToken} />} />
        <Route path="/state/:state" element={<StateList />} />
        <Route path="/elevator/:id" element={<ElevatorDetail />} />
      </Routes>
    </div>
  );
}
