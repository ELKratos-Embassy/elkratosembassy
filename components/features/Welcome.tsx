import Image from 'next/image';
import Button from '../ui/Button';
import Heading from '../ui/Heading';
import { home, section } from '@/constants';
import clsx from 'clsx';

export default function Welcome() {
  const {
    welcome: {
      heading: { text, caption },
      message,
      btn,
      gallery,
      footer,
    },
  } = home;

  return (
    <div className="md:w-10/12 mx-auto mt-32">
      <div className="w-full md:w-2/3 mx-auto">
        <Heading section={section.main} caption={caption} text={text} />
        <p className="mt-8 mb-14 text-center">{message}</p>
        <div className="flex justify-center">
          <Button text={btn} variant="primary" />
        </div>
      </div>

      <div className="flex flex-row justify-center items-center md:items-start gap-6 mt-5 md:-mt-4 flex-wrap md:flex-nowrap">
        {gallery.map(({ src, alt, width, height }, index) => (
          <Image
            key={alt}
            src={src}
            width={width}
            height={height}
            alt={alt}
            className={clsx(
              'w-full h-auto transition-transform duration-300 ease-in-out',
              index > 0 && 'hidden md:block', // Hide subsequent images on small screens
              index === 1 && 'md:mt-12', // Adds spacing for the second image on larger screens
              'hover:scale-105 hover:shadow-lg' // Hover animation for all images
            )}
          />
        ))}
      </div>

      <div className="md:w-3/6 mx-auto flex flex-col gap-4 justify-center mt-16">
        <Heading
          section={section.gallery}
          caption={footer.caption}
          text={footer.text}
        />
        <p className="text-center">{footer.message}</p>
        <Button text={footer.btn.text} icon={footer.btn.icon} />
      </div>
    </div>
  );
}
