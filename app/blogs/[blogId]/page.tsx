import Footer from '@/components/Footer';
import { blogs } from '@/constants';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const {
  posts: { data },
} = blogs;

const Blog = async ({ params }: { params: Promise<{ blogId: string }> }) => {
  const blogId = (await params).blogId;

  const post = data.find((each) => each.id === blogId);
  if (!post) return redirect('/blogs');

  return (
    <div>
      <main className="bg-[#FFD0A040] py-12 md:py-20 px-6 sm:px-8 md:px-16">
        <header className="text-center">
          <h6 className="text-xs uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-100 to-gradient-200">
            {post.tag}
          </h6>
          <h2 className="text-h2 my-4">{post.title}</h2>
          <p>
            <span>{post.date}</span>
            <span> | By {post.author}</span>
          </p>
        </header>

        <Image
          src={post.detail.image[0]}
          alt="Reading the bible"
          width={1280}
          height={406}
          className="w-full my-8 md:my-12"
        />

        {/* Blog Detail */}
        <article className="w-full md:w-10/12 mx-auto">
          <h2 className="text-h2 mt-6">{post.detail.post[0].title}</h2>
          <p className="opacity-80 mt-6">{post.detail.post[0].content[0]}</p>
          <p className="opacity-80 mt-6">{post.detail.post[0].content[1]}</p>

          <Image
            src={post.detail.image[1]}
            alt={post.title}
            width={768}
            height={437}
            className="w-full my-8 md:my-12"
          />

          <section>
            <h4 className="text-h4">{post.detail.post[1].title}</h4>
            <p className="opacity-80 mt-6">{post.detail.post[1].content[0]}</p>

            <blockquote className="leading-loose tracking-tight opacity-80 mt-6 px-6 border-l-4 border-primary">
              {post.detail.post[1].quote}
            </blockquote>

            <p className="opacity-80 mt-6">{post.detail.post[1].content[1]}</p>
          </section>
          <section className="mt-10">
            <h4 className="text-h4">{post.detail.post[2].title}</h4>
            <p className="opacity-80 mt-6">{post.detail.post[2].content[0]}</p>
            <ul className="mt-8 space-y-2 list-disc list-inside">
              {post.detail.post[2].list?.map((each) => (
                <li key={each}>{each}</li>
              ))}
            </ul>
            <p className="opacity-80 mt-8">{post.detail.post[2].content[1]}</p>
            <p className="opacity-80 mt-6">{post.detail.post[2].content[2]}</p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
