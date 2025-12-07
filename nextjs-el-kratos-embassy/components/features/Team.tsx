import { aboutUs, section } from '@/constants';
import Heading from '../ui/Heading';
import Image from 'next/image';
import Link from 'next/link';

const Team = () => {
  const {
    team: {
      heading: { caption, text },
      cards,
    },
  } = aboutUs;
  return (
    <div>
      <Heading text={text} caption={caption} section={section.main} />

      <div className="flex flex-col sm:flex-row flex-wrap gap-6 mt-10 md:mt-16 justify-center">
        {cards.map(({ img, name, post, social }) => (
          <section
            className="py-12 bg-grey w-full sm:w-60 md:w-64 flex flex-col items-center justify-center gap-6"
            key={name}
          >
            <figure className="p-2 rounded-full bg-white">
              <Image
                src={img.src}
                alt={name}
                width={152}
                height={152}
                className="rounded-full w-28 h-28 object-cover"
              />
            </figure>
            <div className="flex flex-col justify-center text-center gap-2">
              <h5 className="text-h5">{name}</h5>
              <p className="opacity-75">{post}</p>
              <div className="flex flex-row gap-5 justify-center">
                {social.map(({ href, src, alt }) => (
                  <Link key={alt} href={href} target="_blank" rel="noopener noreferrer">
                    <Image src={src} alt={alt} width={20} height={20} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Team;
