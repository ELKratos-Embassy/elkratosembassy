'use client';
import { links } from '@/constants';
import Link from 'next/link';
import Button from './Button';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';

const Navigation = () => {
  const pathname = usePathname();

  return (
    <header className="bg-secondary text-white md:px-24 py-3 md:py-0">
      <div className="md:w-10/12 flex flex-wrap flex-col md:flex-row items-center mx-auto justify-between">
        <div className="flex flex-wrap flex-col md:flex-row w-max gap-6 md:gap-16 items-center">
          <div className="">
            <Image
              src="/favicon-32x32.png"
              alt="logo"
              width={32}
              height={32}
              className="w-16 h-16 md:w-12 md:h-12"
            />
            {/* <span>EL Kratos</span> */}
          </div>
          <nav className="md:w-10/12 flex flex-wrap flex-row gap-1 md:gap-12">
            {links.slice(0, -1).map(({ text, href }) => (
              <Link
                href={href}
                key={text}
                className={clsx(href === pathname && 'text-red-500')}
              >
                <Button
                  text={text}
                  variant={href === pathname && 'secondary'}
                />
              </Link>
            ))}
          </nav>
        </div>

        <Link href={links[links.length - 1].href}>
          <Button text={links[links.length - 1].text} variant="nav" />
        </Link>
      </div>
    </header>
  );
};

export default Navigation;
