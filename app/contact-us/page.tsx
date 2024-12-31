import Container from '@/components/Container';
import Header from '@/components/features/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import { contact } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';

const {
  hero: { caption, text },
  address: { location, phone, email },
  social,
} = contact;
const ContactUs = () => {
  return (
    <div>
      <div className="text-white">
        <Header caption={caption} text={text} />
      </div>

      <main className="py-32 px-28 bg-light-orange">
        <section>
          <h5 className="text-h5 uppercase mb-8 font-bold">Contact Form:</h5>

          <div className="flex flex-col md:flex-row gap-24 md:gap-32">
            <form className="flex flex-col gap-3 w-full md:w-1/2">
              <input
                type="text"
                name="name"
                placeholder="Your full Name"
                className="rounded-md p-5 placeholder:text-black"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="rounded-md p-5 placeholder:text-black"
              />
              <input
                type="text"
                name="query"
                placeholder="Query Related"
                className="rounded-md p-5 placeholder:text-black"
              />
              <textarea
                name="message"
                placeholder="Message"
                className="rounded-md p-5 placeholder:text-black"
              ></textarea>

              <Button text="Send message" variant="primary" />
            </form>

            <div className="space-y-8">
              <address className="space-y-8">
                <div>
                  <h5 className="opacity-75 mb-2">Address</h5>
                  <p className="font-semibold">{location}</p>
                </div>

                <div>
                  <h5 className="opacity-75 mb-2">Contact Details</h5>
                  <p className="font-semibold">
                    {phone} {email}
                  </p>
                </div>
              </address>

              <div>
                <h6 className="mb-2">Find us here</h6>
                {/* Connect */}
                <div>
                  <div className="flex items-center gap-8">
                    {social.map(({ src, alt, href }) => (
                      <Link key={alt} href={href}>
                        <Image src={src} alt={alt} width={16} height={16} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Container containerClass="bg-[#161722] text-white placeholder:text-black">
        <Footer />
      </Container>
    </div>
  );
};

export default ContactUs;
