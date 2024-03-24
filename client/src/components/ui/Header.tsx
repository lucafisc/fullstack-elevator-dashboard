import Button from "./Button";

type Props = {
  username: string | undefined;
  logout: () => Promise<void>;
};

export default function Header({ username, logout }: Props) {
  return (
    <header className="flex justify-between items-center mb-10">
      <h1 className="sm:text-3xl text-xl">
        {`Welcome, `}
        <span className="font-bold whitespace-nowrap">{username}</span>
      </h1>
      <Button label={"Logout"} click={logout} />
    </header>
  );
}
