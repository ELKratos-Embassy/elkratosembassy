import clsx from 'clsx';
import { ReactNode } from 'react';

interface ContainerProps {
  containerClass?: string;
  children: ReactNode;
}

export default function Container({
  containerClass,
  children,
}: ContainerProps) {
  return (
    <section
      className={clsx(
        'container mx-auto',
        'space-y-20 md:space-y-32',
        'px-6 py-8 sm:px-12 sm:py-16 md:px-20 md:py-24 lg:px-28',
        containerClass ?? 'bg-white',
      )}
    >
      {children}
    </section>
  );
}
