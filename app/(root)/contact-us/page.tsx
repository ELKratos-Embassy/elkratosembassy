import Header from '@/components/features/Header';
import Footer from '@/components/Footer';
import { contact } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Container from '@/components/Container';

export const metadata: Metadata = {
  title: 'Contact Us | El Kratos Embassy',
  description:
    "Get in touch with El Kratos Embassy. We're here to answer your questions and welcome you into our community.",
};

const ContactUs = () => {
  const {
    hero: { caption, text },
    address: { location, phone, email },
    social,
  } = contact;

  return (
    <>
      <div className="text-white">
        <Header caption={caption} text={text} />
      </div>

      <main className="bg-light-orange">
        <Container containerClass="bg-transparent">
          <section>
            <h1 className="text-h5 uppercase mb-8 font-medium text-secondary-black">
              Contact Form:
            </h1>
            <div className="flex flex-col md:flex-row gap-12 md:gap-32">
              <ContactForm />
              {/* Contact Information */}
              <div className="space-y-12">
                <address className="space-y-8 not-italic">
                  <div className="space-y-2">
                    <h2 className="text-black/75 font-medium">Address</h2>
                    <p className="font-semibold leading-relaxed">{location}</p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-black/75 font-medium">
                      Contact Details
                    </h2>
                    <div className="font-semibold space-y-1">
                      <p>{phone}</p>
                      <p>{email}</p>
                    </div>
                  </div>
                </address>

                <div className="space-y-4">
                  <h2 className="text-black/75 font-medium">Find us here</h2>
                  <div className="flex items-center gap-8">
                    {social.map(({ src, alt, href }) => (
                      <Link
                        key={alt}
                        href={href}
                        className="hover:opacity-80 transition-opacity"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={src}
                          alt={alt}
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default ContactUs;
