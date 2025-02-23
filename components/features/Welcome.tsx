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
      footer,
    },
  } = home;

  const { welcome } = aboutUs;

  return (
    <div className={clsx('md:w-10/12 mx-auto', about ? 'mt-0' : 'mt-32')}>
      <div className="w-full md:w-2/3 mx-auto">
        <Heading section={section.main} caption={caption} text={text} />
        <p className="mt-8 mb-14 text-center">{message}</p>
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
          'flex flex-col md:flex-row justify-center items-center gap-6 mt-5 flex-wrap md:flex-nowrap',
          about ? 'items-center mt-12' : 'md:items-start md:-mt-4 ',
        )}
      >
        {gallery.map(({ src, alt, width, height }, index) => (
          <Image
            key={alt}
            src={src}
            width={width}
            height={height}
            alt={alt}
            className={clsx(
              'w-full md:w-1/3 h-auto transition-transform duration-300 ease-in-out hover:scale-100 md:hover:scale-105 hover:shadow-lg max-md:scale-90',
              index > 0 && 'hidden md:block', // Hide subsequent images on small screens
              index === 1 && !about ? 'md:mt-12' : 'mt-0',

              // about && index === 1
              //   ? 'w-[390px] h-[512px]'
              //   : 'w-[290px] h-[384px]',
            )}
          />
        ))}
      </div>

      {about ? (
        <div className="flex flex-col md:flex-row gap-12 justify-center mt-16 w-full lg:w-10/12 mx-auto">
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
        <div className="md:w-3/6 mx-auto flex flex-col gap-4 justify-center mt-10 md:mt-16">
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
