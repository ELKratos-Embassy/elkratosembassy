import clsx from 'clsx';
import { ReactNode } from 'react';

export default function Container({
  containerClass,
  children,
}: {
  containerClass?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={clsx(
        'space-y-32 px-6 py-8 sm:px-12 sm:py-16 md:px-20 md:py-24 lg:px-28 lg:py-32',
        containerClass ? containerClass : 'bg-white',
      )}
    >
      {children}
    </section>
  );
}
