import { aboutUs } from '@/constants';
import clsx from 'clsx';
import Image from 'next/image';

const AboutBenefit = () => {
  const { benefits } = aboutUs;
  return (
    <div className="space-y-24 w-full md:w-10/12 mx-auto">
      {benefits.map(({ text, message, img: { src, width, height } }, index) => (
        <div
          key={text}
          className={clsx(
            'flex flex-col-reverse gap-6 justify-center items-center',
            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
          )}
        >
          <section className="flex flex-col justify-center gap-4">
            <h4 className="text-h4 uppercase">{text}</h4>
            <p className="max-w-[500px]">{message}</p>
          </section>
          <Image
            src={src}
            alt={text}
            width={width}
            height={height}
            className="w-full md:w-64 h-full lg:w-[500px]"
          />
        </div>
      ))}
    </div>
  );
};

export default AboutBenefit;
