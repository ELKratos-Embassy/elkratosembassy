import { aboutUs } from '@/constants';
import clsx from 'clsx';
import Image from 'next/image';

const AboutBenefit = () => {
  const { benefits } = aboutUs;
  return (
    <div className="space-y-12 md:space-y-20 xl:space-y-24 w-full  mx-auto">
      {benefits.map(({ text, message, img: { src, width, height } }, index) => (
        <div
          key={text}
          className={clsx(
            'flex flex-col-reverse gap-6 md:gap-4 justify-center items-center',
            index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse',
          )}
        >
          <section className="flex flex-col justify-center gap-4 px-4">
            <h4 className="text-h4 uppercase">{text}</h4>
            <p className="max-w-[500px]">{message}</p>
          </section>
          <Image
            src={src}
            alt={text}
            width={width}
            height={height}
            className="w-full sm:w-64 lg:w-96 h-full"
          />
        </div>
      ))}
    </div>
  );
};

export default AboutBenefit;
