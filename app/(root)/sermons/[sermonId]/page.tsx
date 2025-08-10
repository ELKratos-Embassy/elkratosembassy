import Footer from '@/components/Footer';
import Image from 'next/image';
import EventPosts from '@/components/features/EventPosts';
import { sermon } from '@/constants';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SermonForm from '@/components/SermonForm';
import { SanitySermon } from '@/types/sanity';
import { formatDate, getDateParts, getSermon } from '@/sanity/sanityUtil';
import { urlFor } from '@/sanity/image';

export const revalidate = 60; // Revalidate the page every 60 seconds to reflect changes from Sanity Studio


// Generate metadata dynamically
export async function generateMetadata({
  params,
}: {
  params: Promise<{ sermonId: string }>;
}): Promise<Metadata> {
  const sermonId = (await params).sermonId;

  // Try to get Sanity sermon first
  let sanitySermon: SanitySermon | null = null;
  try {
    sanitySermon = await getSermon(sermonId);
  } catch (error) {
    console.error('Error fetching sermon for metadata:', error);
  }

  if (sanitySermon) {
    return {
      title: `${sanitySermon.title} | El Kratos Embassy`,
      description: sanitySermon.description[0] || 'Join us for this transformative sermon experience.',
    };
  }

  // Fallback to constants data
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

  // Try to get Sanity sermon first
  let sanitySermon: SanitySermon | null = null;
  try {
    sanitySermon = await getSermon(sermonId);
  } catch (error) {
    console.error('Error fetching sermon:', error);
  }

  // If Sanity sermon exists, use it
  if (sanitySermon) {
    const { day, month, year } = getDateParts(sanitySermon.eventDate);
    // const formattedDate = formatDate(sanitySermon.eventDate);

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
                    src={
                      sanitySermon.featuredImage
                        ? urlFor(sanitySermon.featuredImage).url()
                        : "/sermons/sermon.png"
                    }
                    alt={sanitySermon.title}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>

                <section className="mt-8 space-y-6">
                  <h6 className="text-xs uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-100 to-gradient-200">
                    {sanitySermon.status === 'upcoming' ? 'Upcoming Event' : 'Past Event'}
                  </h6>
                  <h1 className="text-h2 font-semibold">
                    {sanitySermon.title}
                  </h1>

                  {sanitySermon.description.map((paragraph, index) => (
                    <div key={index}>
                      {index === 0 && (
                        <p className="opacity-80 leading-relaxed">
                          {paragraph}
                        </p>
                      )}

                      {index === 1 && (
                        <blockquote className="leading-relaxed tracking-tight opacity-80 px-6 py-4 border-l-4 border-primary bg-white/50 rounded">
                          {paragraph}
                        </blockquote>
                      )}

                      {index > 1 && (
                        <p className="opacity-80 leading-relaxed">
                          {paragraph}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              </div>

              {/* Right Column - Registration Form */}
              <section className="bg-white w-full md:w-1/2 lg:w-1/3 p-8 md:p-10 rounded-lg shadow-sm h-fit">
                <h2 className="text-h4 font-semibold">
                  {sanitySermon.status === 'upcoming' ? 'Register Now' : 'Event Details'}
                </h2>

                <address className="flex flex-col flex-wrap flex-1 lg:flex-row gap-6 my-8 not-italic">
                  <span className="flex w-full items-start flex-1 gap-2.5">
                    <Image
                      src="/sermons/location.svg"
                      alt="Location"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <span className="text-sm leading-relaxed">
                      {sanitySermon.location.map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < sanitySermon.location.length - 1 && <br />}
                        </span>
                      ))}
                    </span>
                  </span>

                  <span className="flex w-full items-start gap-2.5">
                    <Image
                      src="/sermons/clock.svg"
                      alt="Time"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <span className="text-sm leading-relaxed">
                      {day} {month}, {year}
                      <br />
                      {sanitySermon.times.join(', ')}
                    </span>
                  </span>
                </address>

                {sanitySermon.status === 'upcoming' ? (
                  <SermonForm />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600">This event has concluded.</p>
                  </div>
                )}
              </section>
            </div>
          </div>
          {/* Related Events  */}
          <div className="mt-16">
            <EventPosts title="Upcoming Sermons" single />
          </div>
        </article>

        <Footer />
      </>
    );
  }

  // Fallback to constants data if no Sanity sermon found
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
            <section className="bg-white w-full md:w-1/2 lg:w-1/3 p-8 md:p-10 rounded-lg shadow-sm h-fit">
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
        </div>
        {/* Related Events  */}
        <div className="mt-16">
          <EventPosts title="Upcoming Sermons" single />
        </div>
      </article>

      <Footer />
    </>
  );
};

export default Sermon;
