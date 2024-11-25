import Image from 'next/image';
import Heading from '../ui/Heading';
import { home, section } from '@/constants';
import Button from '../ui/Button';
import clsx from 'clsx';

export default function UpcomingSermons() {
  const {
    sermons: {
      heading: { text, caption },
      card: { date, info },
      bg: { src, alt, width, height },
      btn,
    },
  } = home;

  return (
    <div>
      <div className="mb-16">
        <Heading section={section.main} caption={caption} text={text} />
      </div>
      <div className="flex flex-col lg:flex-row max-lg:gap-4 items-start mb-12 w-full">
        <div className="flex flex-row bg-light-orange p-8 gap-6 w-full">
          <div className="mt-7 ml-14">
            <Heading
              section={section.sermon}
              caption={info.desc.caption}
              text={info.desc.text}
            />
            <p className="mt-4 mb-8 opacity-75">{info.desc.message}</p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4 items-start">
                <Image
                  src={info.time.icon.src}
                  alt={info.time.icon.alt}
                  width={info.time.icon.width}
                  height={info.time.icon.height}
                />
                <p className="flex flex-col">
                  {info.time.text.map((text, i) => (
                    <span
                      className={clsx(i === 0 ? 'leading-none' : 'leading-8')}
                      key={text}
                    >
                      {text}
                    </span>
                  ))}
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <Image
                  src={info.location.icon.src}
                  alt={info.location.icon.alt}
                  width={info.location.icon.width}
                  height={info.location.icon.height}
                />
                <p className="flex flex-col">
                  {info.location.text.map((text, i) => (
                    <span
                      className={clsx(i === 0 ? 'leading-none' : 'leading-8')}
                      key={text}
                    >
                      {text}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <Button text={info.btn} variant="secondary" />
          </div>

          <div className="text-right">
            <h5 className="text-h5 font-bold mb-0 pb-0 leading-none">
              {date.caption}
            </h5>
            <p className="mt-0 pt-0 leading-none">{date.text}</p>
          </div>
        </div>

        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full xl:h-[458px] object-cover xl:aspect-square"
        />
      </div>
      <div className="flex justify-end">
        <Button text={btn.text} icon={btn.icon} />
      </div>
    </div>
  );
}
