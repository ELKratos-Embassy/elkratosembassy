import { section, sermon } from '@/constants';
import Heading from '../ui/Heading';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
const EventPosts = ({ title, single }: { title: string; single?: boolean }) => {
  const {
    events: { data },
  } = sermon;

  return (
    <div
      className={clsx(
        'space-y-32 px-6 py-8',
        single ? 'bg-transparent' : 'bg-white',
      )}
    >
      {/* Blog Posts */}
      <section>
        <h2 className="text-h2 text-center mb-16">{title}</h2>
        <article className="flex flex-wrap flex-col md:flex-row gap-3 lg:gap-6">
          {data.map(({ id, date, info }) => (
            <Link key={id} href={`/sermons/${id}`} className="w-full md:w-96">
              <div
                className={clsx(
                  'flex flex-row  p-8 gap-6 hover:border-b-[16px] border-primary-hover transition-all duration-500 rounded-lg',
                  single ? 'bg-white' : 'bg-light-orange',
                )}
              >
                <div className="mt-7 ml-14">
                  <Heading
                    section={section.sermon}
                    caption={info.desc.caption}
                    text={info.desc.text}
                  />
                  <p className="mt-4 mb-8 opacity-75">
                    {info.desc.message[0].slice(0, 100)}...
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex gap-4 items-start">
                      <Image
                        src={info.time.icon.src}
                        alt={info.time.icon.alt}
                        width={20}
                        height={20}
                      />
                      <p className="flex flex-col">
                        <span>
                          {info.time.text[0]} {info.time.text[1]}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <Image
                        src={info.location.icon.src}
                        alt={info.location.icon.alt}
                        width={20}
                        height={20}
                      />
                      <p className="flex flex-col">
                        <span>
                          {info.location.text[0]} {info.location.text[1]}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <h5 className="text-h5 font-bold mb-0 pb-0 leading-none">
                    {date.caption}
                  </h5>
                  <p className="mt-0 pt-0 leading-none">{date.text}</p>
                </div>
              </div>
            </Link>
          ))}
        </article>
      </section>
    </div>
  );
};

export default EventPosts;
