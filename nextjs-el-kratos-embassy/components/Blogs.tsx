import { getBlogs } from "@/src/sanity/sanityUtil"

export default async function TestSanity() {
  const blogs = await getBlogs()

  return (
    <div className="p-4">
      <h2>Sanity Test</h2>
      <p>Blogs found: {blogs.length}</p>
      {blogs.map((blog: { _id: string; title: string; message: string }) => (
        <div key={blog._id} className="border p-2 m-2">
          <h3>{blog.title}</h3>
          <p>{blog.message}</p>
        </div>
      ))}
    </div>
  )
}