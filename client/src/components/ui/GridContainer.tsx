import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function GridContainer({ children }: Props) {
  return (
    <>
      <div
      data-testid="grid-container"
      className="grid lg:grid-cols-2 gap-4 shadow-md rounded-3xl">
        {children}
      </div>
    </>
  );
}
