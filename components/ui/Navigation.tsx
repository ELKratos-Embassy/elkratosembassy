'use client';
import { links } from '@/constants';
import Link from 'next/link';
import Button from './Button';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

const Navigation = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#161722] text-white px-4 py-3">
      <div className="flex justify-between">
        <div className="sm:flex flex-wrap justify-between gap-4 md:gap-8 w-full">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/favicon-32x32.png"
              alt="logo"
              width={40}
              height={40}
              className="w-10 h-10 md:w-12 md:h-12"
            />
            <span className="hidden sm:block font-semibold text-lg">
              EL KRATOS
            </span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-8 lg:gap-12">
            {links.slice(0, -1).map(({ text, href }) => (
              <Link
                href={href}
                key={text}
                className={clsx(
                  'bg-transparent  transition-colors duration-300 hover:text-primary uppercase',
                  href === pathname && 'text-primary font-semibold',
                )}
              >
                {text}
              </Link>
            ))}
          </nav>

          {/* Call to Action Button */}
          <div className="hidden sm:block w-fit max-md:mx-auto">
            <Link href={links[links.length - 1].href}>
              <Button
                text={links[links.length - 1].text}
                variant={
                  pathname === links[links.length - 1].href
                    ? 'secondary'
                    : 'primary'
                }
              />
            </Link>
          </div>
        </div>
        {/* Mobile Menu Toggle Button */}
        <button
          className="sm:hidden text-xl focus:outline-none transition-transform transform hover:scale-110"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={clsx(
          'flex flex-col items-center sm:hidden gap-3 bg-[#161722] rounded-md shadow-lg transition-transform duration-300 origin-top',
          menuOpen ? 'scale-y-100 py-4' : 'scale-y-0 h-0',
        )}
      >
        {links.map(({ text, href }) => (
          <Link
            href={href}
            key={text}
            className={clsx(
              'w-full text-center py-2 text-white transition-all duration-300 rounded-md hover:bg-primary hover:text-secondary-black',
              href === pathname && 'text-red-500 font-semibold',
            )}
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-sm">{text}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Navigation;
