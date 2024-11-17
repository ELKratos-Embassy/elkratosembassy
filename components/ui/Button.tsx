import clsx from 'clsx';

export default function Button({ text, variant }: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-3 py-3 my-3 md:px-6 md:py-6 md:my-6  rounded-xl backdrop-blur-4xl text-btn w-max',
        variant === 'primary'
          ? 'bg-primary text-secondary-black hover:bg-primary-hover blur-none'
          : variant === 'secondary'
          ? 'bg-secondary-black text-primary hover:text-white'
          : variant === 'nav'
          ? 'bg-primary text-secondary-black hover:bg-primary-hover px-12 py-5'
          : 'px-0'
      )}
    >
      {text.toUpperCase()}
    </button>
  );
}
