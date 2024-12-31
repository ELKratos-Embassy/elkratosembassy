import Container from '@/components/Container';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import EventPosts from '@/components/features/EventPosts';
import { sermon } from '@/constants';
import { redirect } from 'next/navigation';

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
    return redirect('/sermons');
  }
  return (
    <>
      <main className="bg-[#FFD0A040] py-32 px-24">
        {/* Sermon Detail */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-32">
          <div className="w-full md:w-1/2 lg:w-2/3">
            <Image
              src="/sermons/sermon.png"
              alt=""
              width={630}
              height={334}
              className="w-full"
            />
            <section className="mt-6">
              <h6 className="text-xs uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-100 to-gradient-200">
                Upcoming Event
              </h6>
              <h2 className="text-h2 mt-6 ">{event.info.desc.text}</h2>
              <p className="opacity-80 mt-6">
                {event.info.desc.message[0]} {event.info.desc.message[1]}
              </p>

              <blockquote className="leading-loose tracking-tight opacity-80 mt-6 px-6 border-l-4 border-primary">
                {event.info.desc.message[1]}
              </blockquote>
              <p className="opacity-80 mt-6">{event.info.desc.message[2]}</p>
            </section>
          </div>
          <section className="bg-white w-full h-fit md:w-1/2 p-10">
            <h4 className="text-h4 font-semibold">Register Now</h4>
            <address className="flex flex-col lg:flex-row gap-3 my-8">
              <span className="flex w-full items-start gap-2.5 lg:w-1/2">
                {/* Icon */}
                <Image
                  src="/sermons/location.svg"
                  alt="Location"
                  width={24}
                  height={24}
                  className="w-4 h-4 md:w-5 md:h-5"
                />
                {/* Detail */}
                <span>
                  {event.info.location.text[0]} {event.info.location.text[1]}
                </span>
              </span>
              <span className="flex w-full items-start gap-2.5 lg:w-1/2">
                {/* Icon */}
                <Image
                  src="/sermons/clock.svg"
                  alt="Location"
                  width={24}
                  height={24}
                  className="w-4 h-4 md:w-5 md:h-5"
                />
                {/* Detail */}
                <span>
                  {event.date.caption} {event.date.text}, {event.date.year}
                </span>
              </span>
            </address>
            <form className="space-y-8">
              <div className="flex flex-col gap-y-2">
                <label
                  className="opacity-60 text-xs font-medium"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Leonard John"
                  className="border-b border-[#232536] py-2 focus:px-2 focus:border-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  className="opacity-60 text-xs font-medium"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="admin@abc.com"
                  className="border-b border-[#232536] py-2 focus:px-2 focus:border-none transition-all"
                />
              </div>
              <Button text="Register Now" variant="primary" />
            </form>
          </section>
        </div>

        {/* View all events */}
        <EventPosts title="Upcoming Sermons" single />
      </main>
      <Container containerClass="bg-[#161722] text-white">
        <Footer />
      </Container>
    </>
  );
};

export default Sermon;
