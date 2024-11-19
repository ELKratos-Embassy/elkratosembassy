import { home } from '@/constants';
import Image from 'next/image';
import Button from './Button';

export default function Hero() {
  return (
    <div className="relative">
      {/* Text and Button Section */}
      <div className="absolute text-white px-4 md:ml-[110px] w-2/3 md:w-[592px] top-1/2 transform -translate-y-1/2">
        <h4 className="font-medium text-sm md:text-base lg:text-lg">
          {home.hero['sub-heading']}
        </h4>
        <h1 className="text-2xl md:text-h1 leading-snug">
          {home.hero['heading']}
        </h1>

        {/* Button Section */}
        <div className="mt-6 mb-10 md:mt-8 md:mb-16">
          <Button variant="primary" text={home.hero.btn} />
        </div>

        {/* Caption Section */}
        <div className="flex gap-3 items-center">
          <Image
            src="/line.svg"
            alt="Line"
            width={24}
            height={24}
            className="w-4 md:w-8 md:h-8"
          />
          <p className="text-xs md:text-sm lg:text-base">{home.hero.caption}</p>
        </div>
      </div>

      {/* Background Image */}
      <Image
        src="/woman-in-orange-coat-with-black-and-brown-scarf-5418305.svg"
        alt="woman-in-orange-coat-with-black-and-brown-scarf"
        width={1500}
        height={665}
        className="w-full object-cover h-[400px] md:h-[500px] lg:h-[665px]"
      />
    </div>
  );
}
