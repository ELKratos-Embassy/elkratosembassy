import BlogHeader from '@/components/features/BlogHeader';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import { blogs } from '@/constants';
import { blogs as blogPosts } from '@/constants/blogs';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SanityBlog } from '@/types/sanity';
import { getBlogs, getFeaturedBlog } from '@/sanity/sanityUtil';
import { urlFor } from '@/sanity/image';

export const revalidate = 60; // Revalidate the page every 60 seconds to reflect changes from Sanity Studio

export const metadata: Metadata = {
  title: 'Blog | El Kratos Embassy',
  description:
    'Explore spiritual insights, practical wisdom, and community stories from El Kratos Embassy. Learn about faith, resilience, and growth.',
};

const Blogs = async () => {
  const {
    posts: { title, data },
  } = blogs;

  let sanityBlogs: SanityBlog[] = [];
  let featuredBlog: SanityBlog | null = null;

  try {
    // Fetch all blogs and featured blog from Sanity
    [sanityBlogs, featuredBlog] = await Promise.all([
      getBlogs(),
      getFeaturedBlog()
    ]);
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }

  // Determine what to show as featured
  const displayFeaturedBlog = featuredBlog || (sanityBlogs.length > 0 ? sanityBlogs[0] : null);

  // Fallback for constants data
  const fallbackConstantPost = blogPosts[blogPosts.length - 1];

  return (
    <>
      <main className="min-h-screen">
        <article className="bg-[#FFD0A040] py-12 md:py-20 px-6 sm:px-8 md:px-16">
          <BlogHeader />

          {/* Featured Post */}
          <section className="sm:p-8 bg-white flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-6 mt-8 md:mt-16 mb-16 md:mb-24 rounded-lg shadow-sm">
            <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/2 aspect-video">
              <Image
                src={
                  displayFeaturedBlog?.featuredImage
                    ? urlFor(displayFeaturedBlog.featuredImage).url()
                    : (fallbackConstantPost?.detail?.image?.[0] || '/blogs/default.jpg')
                }
                alt="Featured blog post"
                fill
                className="object-cover rounded-t-lg sm:rounded-lg"
                priority
              />
            </div>

            <div className="w-full lg:w-2/3 p-6 sm:p-0 sm:pr-8">
              <header className="text-base flex justify-between md:mb-4">
                <time className="uppercase text-sm">
                  {displayFeaturedBlog
                    ? new Date(displayFeaturedBlog.publishedAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                    : fallbackConstantPost?.date || 'Date not available'
                  }
                </time>
                <span className="uppercase text-sm">
                  BY {displayFeaturedBlog?.author || fallbackConstantPost?.author || 'Unknown Author'}
                </span>
              </header>

              <h1 className="text-h4 mt-3 mb-4 font-bold">
                {displayFeaturedBlog?.title || fallbackConstantPost?.title || 'Blog Title'}
              </h1>
              <p className="text-base opacity-80 line-clamp-3">
                {displayFeaturedBlog?.message || fallbackConstantPost?.message || 'Blog description'}
              </p>

              <div className="mt-8">
                <Button
                  text="Read more"
                  variant="primary"
                  href={`/blogs/${displayFeaturedBlog
                    ? displayFeaturedBlog.slug.current
                    : fallbackConstantPost?.id || '#'
                    }`}
                />
              </div>
            </div>
          </section>

          {/* Blog Posts Grid */}
          <section>
            <h2 className="text-h2 text-center mb-8 md:mb-16">{title}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sanityBlogs.length > 0 ? (
                // Render Sanity blogs (exclude featured if it's the same)
                sanityBlogs
                  // .filter(blog => blog._id !== featuredBlog?._id)
                  .map((blog) => {
                    const formattedDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });

                    return (
                      <Link
                        key={blog._id}
                        href={`/blogs/${blog.slug.current}`}
                        className="group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <article
                          className="h-full bg-white px-8 py-12 rounded-lg
                          group-hover:border-b-[16px] group-hover:border-primary-hover
                          transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <header>
                            <h3 className="text-xs uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-100 to-gradient-200">
                              {blog.tag}
                            </h3>
                            <h4 className="my-4 text-h5 font-bold line-clamp-2">
                              {blog.title}
                            </h4>
                          </header>

                          <p className="opacity-75 line-clamp-3 mb-12">{blog.message}</p>

                          <footer className="mt-auto font-medium space-y-1">
                            <p>By {blog.author}</p>
                            <time className="text-sm text-gray-600">{formattedDate}</time>
                          </footer>
                        </article>
                      </Link>
                    )
                  })
              ) : (
                // Fallback to constants data
                data.map(({ id, tag, title, message, author, date }) => (
                  <Link
                    key={id}
                    href={`/blogs/${id}`}
                    className="group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <article
                      className="h-full bg-white px-8 py-12 rounded-lg
                      group-hover:border-b-[16px] group-hover:border-primary-hover
                      transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <header>
                        <h3 className="text-xs uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-100 to-gradient-200">
                          {tag}
                        </h3>
                        <h4 className="my-4 text-h5 font-bold line-clamp-2">
                          {title}
                        </h4>
                      </header>

                      <p className="opacity-75 line-clamp-3 mb-12">{message}</p>

                      <footer className="mt-auto font-medium space-y-1">
                        <p>By {author}</p>
                        <time className="text-sm text-gray-600">{date}</time>
                      </footer>
                    </article>
                  </Link>
                ))
              )}
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
};

export default Blogs;
