export default {
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tag',
      title: 'Tag',
      type: 'string',
      options: {
        list: [
          { title: 'Spiritual Growth', value: 'Spiritual Growth' },
          { title: 'Faith Development', value: 'Faith Development' },
          { title: 'Faith Application', value: 'Faith Application' },
          { title: 'Community', value: 'Community' },
          { title: 'Biblical Wisdom', value: 'Biblical Wisdom' },
          { title: 'Leadership', value: 'Leadership' },
          { title: 'Discipleship', value: 'Discipleship' },
          { title: 'Church Innovation', value: 'Church Innovation' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'message',
      title: 'Summary Message',
      type: 'text',
      validation: (Rule: any) => Rule.required().max(300),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'El Kratos Embassy',
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'additionalImage',
      title: 'Additional Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'content',
      title: 'Blog Content',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'content',
              title: 'Content Paragraphs',
              type: 'array',
              of: [{ type: 'text' }],
              validation: (Rule: any) => Rule.required().min(1),
            },
            {
              name: 'quote',
              title: 'Quote (Optional)',
              type: 'text',
            },
            {
              name: 'list',
              title: 'List Items (Optional)',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
        },
      ],
      validation: (Rule: any) => Rule.required().min(2).max(3),
    },
    {
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'featuredImage',
    },
    prepare(selection: any) {
      const { author } = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      })
    },
  },
}