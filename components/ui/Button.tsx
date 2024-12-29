import clsx from 'clsx';
import Image from 'next/image';

export default function Button({ text, variant, icon }: ButtonProps) {
  if (icon)
    return (
      <button
        className={clsx(
          'flex flex-wrap flex-row justify-center items-center gap-1',
        )}
      >
        <span>{text}</span>
        <Image src={icon} width={18} height={10} alt="arrow right" />
      </button>
    );
  return (
    <button
      className={clsx(
        'btn px-4 py-2 my-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-300 ease-in-out',
        variant === 'primary'
          ? 'bg-primary text-secondary-black hover:bg-primary-hover'
          : variant === 'secondary'
          ? 'bg-secondary-black text-primary hover:text-white'
          : variant === 'nav'
          ? 'bg-transparent text-white hover:text-red-400'
          : '',
      )}
    >
      {text}
    </button>
  );
}
