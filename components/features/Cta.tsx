import { home } from '@/constants';
import Button from '../ui/Button';
import Image from 'next/image';

const Cta = () => {
  const {
    cta: {
      card: { text, message, btn },
      icon: { src, alt, width, height },
    },
  } = home;

  return (
    <div className={`py-32 bg-cta bg-cover bg-center `}>
      <div className="flex flex-col w-fit mx-auto">
        <div
          className="px-8 md:px-16 p-8
          md:py-12 flex flex-col md:justify-between md:flex-row justify-center 
        gap-12
          md:gap-24
           bg-white hover:border-b-16 border-primary transition-all"
        >
          <section className="max-w-[500px]">
            <h2 className="text-h2 text-center md:text-left">{text}</h2>
            <p className="py-4">{message}</p>
            <Button
              text={btn}
              variant="primary"
              className="hover:shadow-lg transition-shadow"
            />
          </section>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="mx-auto md:mx-auto w-28 md:w-32"
          />
        </div>
      </div>
    </div>
  );
};

export default Cta;
