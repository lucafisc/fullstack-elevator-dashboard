type Props = {
  label: string;
  click: () => Promise<void>;
};

export default function Button({ label, click }: Props) {
  return (
    <div>
      <button
        className="shadow-md border border-outline bg-primary rounded-xl p-2 transition-all hover:bg-white hover:text-black active:scale-95 active:bg-accent active:border-accent active:text-white"
        onClick={() => click()}
      >
        {label}
      </button>
    </div>
  );
}
