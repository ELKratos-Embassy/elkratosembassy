import Image from 'next/image';
import Button from '../ui/Button';
import Heading from '../ui/Heading';
import { home, section, aboutUs } from '@/constants';
import clsx from 'clsx';
import Link from 'next/link';

export default function Welcome({ about }: { about?: boolean }) {
  const {
    welcome: {
      heading: { text, caption },
      message,
      btn,
      gallery,
      galleryMobile,
      footer,
    },
  } = home;

  const { welcome } = aboutUs;

  return (
    <div className={clsx('md:w-full mx-auto', about ? 'mt-0' : 'mt-32')}>
      <div className="w-full md:w-full mx-auto">
        <Heading section={section.main} caption={caption} text={text} />
        <p className="mt-8 mb-10 text-center">{message}</p>
        <div className="flex justify-center">
          <Button
            text={btn}
            variant="primary"
            className="hover:shadow-lg transition-shadow"
          />
        </div>
      </div>

      <div
        className={clsx(
          'flex flex-col md:flex-row justify-center items-center gap-8 mt-5 flex-wrap md:flex-nowrap',
          about ? 'items-center mt-12' : 'md:items-start md:-mt-4 ',
        )}
      >
        <Image
          key={galleryMobile.alt}
          src={galleryMobile.src}
          width={galleryMobile.width}
          height={galleryMobile.height}
          alt={galleryMobile.alt}
          className={clsx(
            'w-full h-auto transition-transform duration-300 ease-in-out hover:scale-100  hover:shadow-lg max-md:scale-90 rounded-3xl md:hidden',
          )}
        />
        {gallery.map(({ src, alt, width, height }, index) => (
          <Image
            key={alt}
            src={src}
            width={width}
            height={height}
            alt={alt}
            className={clsx(
              'hidden md:block md:w-1/3 h-auto transition-transform duration-300 ease-in-out hover:scale-100 md:hover:scale-105 hover:shadow-lg max-md:scale-90 rounded-3xl',

              index === 1 && !about ? 'md:mt-12' : 'mt-0',
            )}
          />
        ))}
      </div>

      {about ? (
        <div className="flex flex-col md:flex-row gap-12 justify-center mt-16 w-full mx-auto">
          {/* About Us Welcome */}
          {welcome.map((each) => (
            <section key={each.heading.text} className="space-y-4">
              <Heading
                about
                caption={each.heading.caption}
                text={each.heading.text}
                section={section.gallery}
              />

              <p>{each.message}</p>
            </section>
          ))}
        </div>
      ) : (
        <div className="md:w-full mx-auto flex flex-col gap-4 justify-center mt-10 md:mt-16">
          <Heading
            section={section.gallery}
            caption={footer.caption}
            text={footer.text}
          />
          <p className="text-center">{footer.message}</p>
          <Link
            href="/about-us"
            className="w-fit mx-auto hover:ring-1 ring-primary p-2 transition-all rounded-full hover:scale-105"
          >
            <Button
              text={footer.btn.text}
              icon={footer.btn.icon}
              variant="nav"
              className="hover:scale-105 transition-transform"
            />
          </Link>
        </div>
      )}
    </div>
  );
}
