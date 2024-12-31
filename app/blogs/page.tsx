import Container from '@/components/Container';
import BlogHeader from '@/components/features/BlogHeader';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import { blogs } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';

const {
  hero: { image, date, author, text, message, btn },
  posts: { title, data },
} = blogs;

const Blogs = () => {
  return (
    <div>
      <main className="bg-[#FFD0A040] py-32 px-6 sm:px-8 md:px-24">
        <BlogHeader />
        {/* Latest Post */}
        <div className="p-14 bg-white flex flex-col lg:flex-row justify-between items-center gap-12 mt-16 mb-32">
          <Image
            src={image}
            alt="Reading the bible"
            width={572}
            height={384}
            className="w-full lg:w-1/2"
          />
          <section className="w-full lg:w-2/3">
            <h6 className="text-base flex justify-between">
              <span className="uppercase">{date}</span>
              <span className="uppercase">BY {author}</span>
            </h6>
            <h4 className="text-h4 mt-3 mb-4 font-bold">{text}</h4>
            <p className="text-base opacity-80">{message}</p>
            <div className="mt-8">
              <Button text={btn} variant="primary" />
            </div>
          </section>
        </div>

        {/* Blog Posts */}
        <section>
          <h2 className="text-h2 text-center mb-16">{title}</h2>

          <article className="flex flex-wrap flex-col md:flex-row gap-3 lg:gap-6">
            {data.map(({ id, tag, title, message, author, date }) => (
              <Link key={id} href={`/blogs/${id}`}>
                <section
                  className="w-full md:w-[302px] bg-white px-8
                py-12 hover:border-b-[16px]
							  border-primary-hover rounded-lg transition-all duration-500"
                >
                  <h6 className="text-xs uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-100 to-gradient-200">
                    {tag}
                  </h6>
                  <h5 className="my-4 text-h5 font-bold">{title}</h5>
                  <p className="opacity-75">{message}</p>

                  <p className="mt-12 flex flex-col font-medium">
                    <span>By {author}</span>
                    <span>{date}</span>
                  </p>
                </section>
              </Link>
            ))}
          </article>
        </section>
      </main>
      <Container containerClass="bg-[#161722] text-white">
        <Footer />
      </Container>
    </div>
  );
};

export default Blogs;
