import Footer from '@/components/Footer';
import { blogs } from '@/constants';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBlog } from '@/sanity/lib/sanityUtil';
import { urlFor } from '@/sanity/lib/image';
import { SanityBlog } from '@/types/sanity';

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: {
  params: Promise<{ blogId: string }>;
}): Promise<Metadata> {
  const blogId = (await params).blogId;

  // Try to get Sanity blog first
  let sanityBlog: SanityBlog | null = null;
  try {
    sanityBlog = await getBlog(blogId);
  } catch (error) {
    console.error('Error fetching blog for metadata:', error);
  }

  if (sanityBlog) {
    return {
      title: `${sanityBlog.title} | El Kratos Embassy Blog`,
      description: sanityBlog.message,
    };
  }

  // Fallback to constants data
  const post = blogs.posts.data.find((each) => each.id === blogId);

  if (!post) {
    return {
      title: 'Blog Post Not Found | El Kratos Embassy',
    };
  }

  return {
    title: `${post.title} | El Kratos Embassy Blog`,
    description: post.message,
  };
}

const Blog = async ({ params }: { params: Promise<{ blogId: string }> }) => {
  const blogId = (await params).blogId;

  // Try to get Sanity blog first
  let sanityBlog: SanityBlog | null = null;
  try {
    sanityBlog = await getBlog(blogId);
  } catch (error) {
    console.error('Error fetching blog:', error);
  }

  // If Sanity blog exists, use it
  if (sanityBlog) {
    const formattedDate = new Date(sanityBlog.publishedAt).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return (
      <>
        <article className="min-h-screen bg-[#FFD0A040]">
          <div className="container mx-auto py-12 md:py-20 px-6 sm:px-8 md:px-16">
            {/* Blog Header */}
            <header className="text-center max-w-4xl mx-auto">
              <h1 className="text-xs uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-100 to-gradient-200">
                {sanityBlog.tag}
              </h1>
              <h2 className="text-h2 my-4 font-semibold">{sanityBlog.title}</h2>
              <div className="flex items-center justify-center gap-2 text-sm">
                <time dateTime={sanityBlog.publishedAt} className="text-gray-700">
                  {formattedDate}
                </time>
                <span className="text-gray-400">|</span>
                <span className="text-gray-700">By {sanityBlog.author}</span>
              </div>
            </header>

            {/* Featured Image */}
            {sanityBlog.featuredImage && (
              <figure className="my-8 md:my-12 relative aspect-[16/9] w-full max-w-6xl mx-auto">
                <Image
                  src={urlFor(sanityBlog.featuredImage).url()}
                  alt={sanityBlog.title}
                  fill
                  className="object-cover rounded-lg shadow-sm"
                  priority
                />
              </figure>
            )}

            {/* Blog Content */}
            <div className="max-w-4xl mx-auto prose prose-lg">
              {/* Introduction */}
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {sanityBlog.message}
              </p>

              {/* Dynamic Content Sections */}
              {sanityBlog.content.map((section, index) => (
                <section key={index} className={index > 0 ? 'mt-10' : ''}>
                  <h2 className="text-h3 mt-6 font-semibold">
                    {section.title}
                  </h2>

                  <div className="space-y-6 mt-6">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.quote && (
                    <blockquote className="my-8 pl-6 border-l-4 border-primary bg-white/50 p-6 rounded-r-lg italic text-gray-700">
                      {section.quote}
                    </blockquote>
                  )}

                  {section.list && (
                    <ul className="mt-8 space-y-2 list-disc list-inside pl-4">
                      {section.list.map((item, lIndex) => (
                        <li key={lIndex} className="text-gray-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Show additional image after first section if available */}
                  {index === 0 && sanityBlog.additionalImage && (
                    <figure className="my-8 md:my-12 relative aspect-[16/9] w-full">
                      <Image
                        src={urlFor(sanityBlog.additionalImage).url()}
                        alt={`${sanityBlog.title} - Additional Image`}
                        fill
                        className="object-cover rounded-lg shadow-sm"
                      />
                    </figure>
                  )}
                </section>
              ))}
            </div>
          </div>
        </article>

        <Footer />
      </>
    );
  }

  // Fallback to constants data if no Sanity blog found
  const post = blogs.posts.data.find((each) => each.id === blogId);

  if (!post) {
    notFound();
  }

  return (
    <>
      <article className="min-h-screen bg-[#FFD0A040]">
        <div className="container mx-auto py-12 md:py-20 px-6 sm:px-8 md:px-16">
          {/* Blog Header */}
          <header className="text-center max-w-4xl mx-auto">
            <h1 className="text-xs uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-100 to-gradient-200">
              {post.tag}
            </h1>
            <h2 className="text-h2 my-4 font-semibold">{post.title}</h2>
            <div className="flex items-center justify-center gap-2 text-sm">
              <time dateTime={post.date} className="text-gray-700">
                {post.date}
              </time>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700">By {post.author}</span>
            </div>
          </header>

          {/* Featured Image */}
          <figure className="my-8 md:my-12 relative aspect-[16/9] w-full max-w-6xl mx-auto">
            <Image
              src={post.detail.image[0]}
              alt={post.title}
              fill
              className="object-cover rounded-lg shadow-sm"
              priority
            />
          </figure>

          {/* Blog Content */}
          <div className="max-w-4xl mx-auto prose prose-lg">
            {/* First Section */}
            <section>
              <h2 className="text-h3 mt-6 font-semibold">
                {post.detail.post[0].title}
              </h2>
              <div className="space-y-6 mt-6">
                {post.detail.post[0].content.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Second Image */}
            <figure className="my-8 md:my-12 relative aspect-[16/9] w-full">
              <Image
                src={post.detail.image[1]}
                alt={`${post.title} - Additional Image`}
                fill
                className="object-cover rounded-lg shadow-sm"
              />
            </figure>

            {/* Second Section */}
            <section>
              <h3 className="text-h4 font-semibold">
                {post.detail.post[1].title}
              </h3>
              <div className="space-y-6 mt-6">
                {post.detail.post[1].content.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {post.detail.post[1].quote && (
                <blockquote className="my-8 pl-6 border-l-4 border-primary bg-white/50 p-6 rounded-r-lg italic text-gray-700">
                  {post.detail.post[1].quote}
                </blockquote>
              )}
            </section>

            {/* Third Section */}
            <section className="mt-10">
              <h3 className="text-h4 font-semibold">
                {post.detail.post[2].title}
              </h3>
              <div className="space-y-6 mt-6">
                {post.detail.post[2].content.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                {post.detail.post[2].list && (
                  <ul className="mt-8 space-y-2 list-disc list-inside pl-4">
                    {post.detail.post[2].list.map((item) => (
                      <li key={item} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
};

export default Blog;
