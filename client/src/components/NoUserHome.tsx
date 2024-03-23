import SmallBtn from "./SmallBtn";

type Props = {
  login: () => Promise<void>;
};

export function Home({ login }: Props) {
  return (
    <div className="h-full flex items-center sm:justify-between flex-col sm:flex-row justify-center text-center sm:text-left gap-4">
      <h1 className="text-3xl">
        <span className="font-bold">{`Welcome, `}</span>
        please login to continue
      </h1>
      <SmallBtn label={"Login"} click={login} />
    </div>
  );
}
