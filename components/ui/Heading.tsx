import { ReactNode } from 'react';

export default function Heading({ children }: { children: ReactNode }) {
  return <h1 className="text-h1 text-center my-5">{children}</h1>;
}
