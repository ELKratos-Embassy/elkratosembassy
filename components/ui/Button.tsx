import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'nav';
  icon?: string;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({
  text,
  variant = 'primary',
  icon,
  href,
  className,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const buttonClasses = clsx(
    'inline-flex items-center justify-center',
    'px-5 py-3 md:px-6 md:py-4',
    'rounded-lg',
    'text-sm md:text-base font-medium',
    'transition-all duration-300 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    variant === 'primary' && [
      'bg-primary text-secondary-black',
      'hover:bg-primary-hover',
      'focus:ring-primary',
      'disabled:opacity-60 disabled:cursor-not-allowed',
    ],
    variant === 'secondary' && [
      'bg-secondary-black text-primary',
      'hover:text-white',
      'focus:ring-secondary-black',
      'disabled:opacity-60 disabled:cursor-not-allowed',
    ],
    variant === 'nav' && [
      'bg-transparent text-primary',
      'hover:text-primary',
      'focus:ring-white',
      'disabled:opacity-60 disabled:cursor-not-allowed',
    ],
    className,
  );

  const content = (
    <>
      <span>{text}</span>
      {icon && (
        <Image
          src={icon}
          width={18}
          height={10}
          alt=""
          className="ml-2"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={buttonClasses}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
