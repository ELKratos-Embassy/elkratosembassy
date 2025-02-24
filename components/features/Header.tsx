import clsx from 'clsx';
import React from 'react';

const Header = ({ caption, text }: { caption: string; text: string }) => {
  return (
    <header
      className={clsx(
        `space-y-4 h-[409px] flex flex-col justify-center max-sm:text-center px-4 sm:px-12 md:pl-28 bg-no-repeat bg-cover bg-bottom`,
        caption === 'About us'
          ? 'bg-hero-about bg-center'
          : caption === 'Sermon'
          ? 'bg-hero-sermon'
          : 'bg-hero-contact',
      )}
    >
      <p
        className={clsx(
          'uppercase',
          caption === 'Sermon' ? 'text-white' : 'text-primary',
        )}
      >
        {caption}
      </p>
      <h2
        className={clsx(
          'text-h2 font-bold',
          caption === 'Sermon' ? 'text-white' : 'text-primary',
        )}
      >
        {text}
      </h2>
    </header>
  );
};

export default Header;
