import clsx from 'clsx';
import React from 'react';

const Header = ({ caption, text }: { caption: string; text: string }) => {
  return (
    <header
      className={clsx(
        `h-[409px] flex flex-col justify-center max-sm:text-center px-4 sm:px-12 md:pl-28 bg-no-repeat bg-cover bg-bottom relative`,
        caption === 'About us'
          ? 'bg-hero-about bg-center'
          : caption.includes('Sermon')
          ? 'bg-hero-sermon'
          : 'bg-hero-contact',
      )}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 space-y-4 ">
        <p className="uppercase text-primary">{caption}</p>
        <h2 className="text-h2 font-bold text-primary">{text}</h2>
      </div>
    </header>
  );
};

export default Header;
