import { home, section } from '@/constants';
import Heading from '../ui/Heading';
import Image from 'next/image';
import AboutBenefit from './AboutBenefit';

export default function Benefits({ about }: { about?: boolean }) {
  const {
    benefits: {
      heading: { caption, text },
      cards,
    },
  } = home;

  return (
    <div>
      <div className="mb-16">
        <Heading section={section.main} caption={caption} text={text} />
      </div>

      {about ? (
        <AboutBenefit />
      ) : (
        <div className="flex flex-col sm:flex-row justify-center gap-6 flex-wrap">
          {cards.map(({ id, caption, text, bg }) => (
            <div
              className="relative w-full max-sm:mx-auto max-w-sm sm:w-64 h-60  lg:w-72 lg:h-80 group overflow-hidden rounded-lg"
              key={id}
            >
              {/* Background Image */}
              <Image
                src={bg.src}
                alt={bg.alt}
                width={bg.width}
                height={bg.height}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-700"></div>

              {/* Content */}
              <div className="absolute bottom-0 translate-y-1/2 p-8 flex flex-col group-hover:translate-y-0 text-white z-20 transition-all duration-700">
                <h5 className="text-lg font-extrabold uppercase">{caption}</h5>
                <p className="opacity-0 group-hover:opacity-100 text-sm mt-4 transition-opacity duration-500">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
