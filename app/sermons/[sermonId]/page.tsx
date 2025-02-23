import Footer from '@/components/Footer';
import Image from 'next/image';
import EventPosts from '@/components/features/EventPosts';
import { sermon } from '@/constants';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SermonForm from '@/components/SermonForm';

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: {
  params: { sermonId: string };
}): Promise<Metadata> {
  const sermonId = (await params).sermonId;

  const event = sermon.events.data.find((each) => each.id === sermonId);

  if (!event) {
    return {
      title: 'Sermon Not Found | El Kratos Embassy',
    };
  }

  return {
    title: `${event.info.desc.text} | El Kratos Embassy`,
    description: event.info.desc.message[0],
  };
}

const Sermon = async ({
  params,
}: {
  params: Promise<{ sermonId: string }>;
}) => {
  const sermonId = (await params).sermonId;
  const {
    events: { data },
  } = sermon;

  const event = data.find((each) => each.id === sermonId);

  if (!event) {
    notFound();
  }

  return (
    <>
      <article className="bg-light-orange py-12 md:py-20">
        <div className="container mx-auto px-6 sm:px-8 md:px-16">
          {/* Sermon Detail */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-6 md:mb-12">
            {/* Left Column - Sermon Content */}
            <div className="w-full md:w-1/2 lg:w-2/3">
              <div className="relative aspect-video w-full">
                <Image
                  src="/sermons/sermon.png"
                  alt={event.info.desc.text}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>

              <section className="mt-8 space-y-6">
                <h6 className="text-xs uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-100 to-gradient-200">
                  Upcoming Event
                </h6>
                <h1 className="text-h2 font-semibold">
                  {event.info.desc.text}
                </h1>
                <p className="opacity-80 leading-relaxed">
                  {event.info.desc.message[0]} {event.info.desc.message[1]}
                </p>

                <blockquote className="leading-relaxed tracking-tight opacity-80 px-6 py-4 border-l-4 border-primary bg-white/50 rounded">
                  {event.info.desc.message[1]}
                </blockquote>

                <p className="opacity-80 leading-relaxed">
                  {event.info.desc.message[2]}
                </p>
              </section>
            </div>

            {/* Right Column - Registration Form */}
            <section className="bg-white w-full md:w-1/2 p-8 md:p-10 rounded-lg shadow-sm h-fit">
              <h2 className="text-h4 font-semibold">Register Now</h2>

              <address className="flex flex-col lg:flex-row gap-6 my-8 not-italic">
                <span className="flex w-full items-start gap-2.5 lg:w-1/2">
                  <Image
                    src="/sermons/location.svg"
                    alt="Location"
                    width={20}
                    height={20}
                    className="mt-1"
                  />
                  <span className="text-sm leading-relaxed">
                    {event.info.location.text[0]} <br />
                    {event.info.location.text[1]}
                  </span>
                </span>

                <span className="flex w-full items-start gap-2.5 lg:w-1/2">
                  <Image
                    src="/sermons/clock.svg"
                    alt="Time"
                    width={20}
                    height={20}
                    className="mt-1"
                  />
                  <span className="text-sm leading-relaxed">
                    {event.date.caption} {event.date.text}, {event.date.year}
                  </span>
                </span>
              </address>

              <SermonForm />
            </section>
          </div>

          {/* Related Events */}
          <section className="mt-16">
            <EventPosts title="Upcoming Sermons" single />
          </section>
        </div>
      </article>

      <Footer />
    </>
  );
};

export default Sermon;
