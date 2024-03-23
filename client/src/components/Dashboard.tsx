import { GetTokenSilentlyOptions, User } from "@auth0/auth0-react";
import SmallBtn from "./SmallBtn";
import StateOverview from "./StateOverview";

type Props = {
  user: User;
  logout: () => Promise<void>;
  getToken: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>;
};

export default function Dashboard({ user, logout, getToken }: Props) {
  return (
    <>
    <div className="flex justify-between items-center">
      <h1 className="text-3xl">{`Welcome, `}
      <span className="font-bold whitespace-nowrap">
        {user.name}
        </span> 
        </h1>
      <SmallBtn label={"Logout"} click={logout} />
    </div>
    <StateOverview getToken={getToken}/>
    </>
  );
}
