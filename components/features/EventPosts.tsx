import { section, sermon } from '@/constants';
import Heading from '../ui/Heading';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

interface EventPostsProps {
  title: string;
  single?: boolean;
}

const EventPosts = ({ title, single }: EventPostsProps) => {
  const {
    events: { data },
  } = sermon;

  return (
    <div
      className={clsx(
        'py-12 md:py-20 px-6 sm:px-8 md:px-16',
        single ? 'bg-transparent' : 'bg-white',
      )}
    >
      <section className="container mx-auto">
        <h2 className="text-h2 text-center mb-6 md:mb-12">{title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {data.map(({ id, date, info }) => (
            <Link
              key={id}
              href={`/sermons/${id}`}
              className="group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <article
                className={clsx(
                  'p-8 py-4 rounded-lg transition-all duration-300',
                  'hover:border-b-[16px] border-primary-hover',
                  single ? 'bg-white' : 'bg-light-orange',
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow mt-3 md:mt-6">
                    <Heading
                      section={section.sermon}
                      caption={info.desc.caption}
                      text={info.desc.text}
                    />
                    <p className="mt-4 mb-8 opacity-75 line-clamp-3">
                      {info.desc.message[0]}
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex gap-4 items-center">
                        <Image
                          src={info.time.icon.src}
                          alt={info.time.icon.alt}
                          width={20}
                          height={20}
                          className="flex-shrink-0"
                        />
                        <p className="flex flex-col">
                          <span>{info.time.text.join(' ')}</span>
                        </p>
                      </div>

                      <div className="flex gap-4 items-center">
                        <Image
                          src={info.location.icon.src}
                          alt={info.location.icon.alt}
                          width={20}
                          height={20}
                          className="flex-shrink-0"
                        />
                        <p className="flex flex-col">
                          <span>{info.location.text.join(' ')}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <h5 className="text-h5 font-bold leading-none">
                      {date.caption}
                    </h5>
                    <p className="mt-1 leading-none">{date.text}</p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventPosts;
