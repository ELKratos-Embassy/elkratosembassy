'use client';
import { useState, useEffect } from 'react';
import { links } from '@/constants';
import Link from 'next/link';
import Button from './Button';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={clsx(
          'w-full transition-all duration-300',
          isScrolled
            ? 'bg-secondary-black/95 backdrop-blur-sm py-4'
            : 'bg-secondary-black py-6',
        )}
      >
        <div className="container mx-auto px-6 sm:px-8 md:px-16">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-50">
              <Image
                src="/logo.png"
                alt="El Kratos Embassy"
                width={50}
                height={32}
                className="w-16 md:w-20"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12">
              <div className="flex items-center gap-8">
                {links.slice(0, -1).map(({ text, href }) => (
                  <Link
                    key={text}
                    href={href}
                    className={clsx(
                      'hover:text-primary transition-colors',
                      pathname === href
                        ? 'text-primary font-medium'
                        : 'text-white',
                    )}
                  >
                    {text}
                  </Link>
                ))}
              </div>
              <Button
                text="Contact us"
                variant="primary"
                href="/contact-us"
                className="whitespace-nowrap"
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="relative z-50 md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <div className="flex flex-col gap-1.5">
                <span
                  className={clsx(
                    'w-6 h-0.5 bg-white transition-transform duration-300',
                    isOpen && 'rotate-45 translate-y-2',
                  )}
                />
                <span
                  className={clsx(
                    'w-6 h-0.5 bg-white transition-opacity duration-300',
                    isOpen && 'opacity-0',
                  )}
                />
                <span
                  className={clsx(
                    'w-6 h-0.5 bg-white transition-transform duration-300',
                    isOpen && '-rotate-45 -translate-y-2',
                  )}
                />
              </div>
            </button>

            {/* Mobile Navigation */}
            <div
              className={clsx(
                'absolute inset-x-0 top-full bg-secondary-black/95 backdrop-blur-sm transition-all duration-300 md:hidden',
                isOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-4 pointer-events-none',
              )}
            >
              <div className="flex flex-col items-center justify-center py-8 gap-8">
                {links.slice(0, -1).map(({ text, href }) => (
                  <Link
                    key={text}
                    href={href}
                    className={clsx(
                      'text-lg hover:text-primary transition-colors',
                      pathname === href
                        ? 'text-primary font-medium'
                        : 'text-white',
                    )}
                  >
                    {text}
                  </Link>
                ))}
                <Button
                  text="Contact us"
                  variant="primary"
                  href="/contact-us"
                  className="whitespace-nowrap"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
