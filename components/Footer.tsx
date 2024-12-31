import Image from 'next/image';
import Link from 'next/link';
import { home } from '@/constants';
import NewsletterForm from './NewsletterForm';

const Footer = () => {
  const {
    footer: {
      left,
      connect,
      quicklinks: { text, nav },
      subscribe,
    },
  } = home;

  return (
    <div className="flex flex-col flex-wrap gap-12  lg:flex-row md:justify-between">
      <div className="flex flex-col gap-12 sm:flex-row md:gap-[270px] lg:gap-[350px] justify-between">
        <section>
          <h4 className="text-primary tracking-widest text-2xl lg:text-4xl font-mono">
            EL Kratos
          </h4>

          <h6 className="text-[12px] mt-7 mb-8 opacity-75 uppercase">
            {left.caption}
          </h6>
          <div className="text-[12px] space-y-4 opacity-75">
            <p>{left.phoneNumber}</p>
            <p className="uppercase">{left.address}</p>
            <p className="uppercase">{left.email}</p>
          </div>
        </section>

        <div className="flex flex-row gap-20">
          {/* Quicklinks */}
          <div>
            <h6 className="mb-5">{text}</h6>
            <ul className="flex flex-col gap-6 opacity-75">
              {nav.map((link: { href: string; text: string }) => (
                <Link
                  key={link.text}
                  href={link.href}
                  className="text-[12px] uppercase"
                >
                  {link.text}
                </Link>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h6 className="mb-5">{connect.text}</h6>
            <div className="flex gap-5">
              {connect.icons.map((icon) => (
                <Link key={icon.alt} href={icon.href}>
                  <Image src={icon.src} alt={icon.alt} width={16} height={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Newsletter */}
      <section>
        <h4 className="text-h4 mb-8 max-w-[500px] uppercase">
          {subscribe.text}
        </h4>

        <NewsletterForm />
      </section>
    </div>
  );
};

export default Footer;
