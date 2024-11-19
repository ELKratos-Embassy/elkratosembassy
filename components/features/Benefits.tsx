import { home } from '@/constants';
import Heading from '../ui/Heading';
import Image from 'next/image';

export default function Benefits() {
  const {
    benefits: {
      heading: { caption, text },
      cards,
    },
  } = home;

  return (
    <div className="">
      <div className="mb-16">
        <Heading caption={caption} text={text} />
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6 flex-wrap">
        {cards.map(({ caption, text, bg }) => (
          <div
            className="relative w-full max-w-sm sm:w-80 h-80 group overflow-hidden rounded-lg"
            key={caption}
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
              <h5 className="text-lg font-extrabold">
                {caption.toUpperCase()}
              </h5>
              <p className="opacity-0 group-hover:opacity-100 text-sm mt-4 transition-opacity duration-500">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
