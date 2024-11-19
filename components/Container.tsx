import clsx from 'clsx';
import { ReactNode } from 'react';

export default function Container({
  bg,
  children,
}: {
  bg?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={clsx(
        'bg-white px-6 py-8 sm:px-12 sm:py-16 md:px-20 md:py-24 lg:px-28 lg:py-32',
        bg && 'bg-grey'
      )}
    >
      {children}
    </section>
  );
}
