import { LogoutOptions } from "@auth0/auth0-react";
import Button from "./Button";

type Props = {
  username: string | undefined;
  logout: (options?: LogoutOptions | undefined) => Promise<void>;
};

export default function Header({ username, logout }: Props) {
  return (
    <header className="flex items-center justify-between mb-10">
      <h1 className="text-xl sm:text-3xl">
        {`Welcome, `}
        <span className="font-bold whitespace-nowrap">{username}</span>
      </h1>
      <Button label={"Logout"} click={() => logout({ logoutParams: { returnTo: window.location.origin } })} />
    </header>
  );
}
