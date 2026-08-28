import type { ReactNode } from "react";

type PrivateLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function PrivateLayout({ children, modal }: PrivateLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
