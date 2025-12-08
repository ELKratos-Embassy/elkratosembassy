import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      options: {
        list: [
          {title: 'Spiritual Growth', value: 'Spiritual Growth'},
          {title: 'Faith Development', value: 'Faith Development'},
          {title: 'Faith Application', value: 'Faith Application'},
          {title: 'Community', value: 'Community'},
          {title: 'Biblical Wisdom', value: 'Biblical Wisdom'},
          {title: 'Leadership', value: 'Leadership'},
          {title: 'Discipleship', value: 'Discipleship'},
          {title: 'Church Innovation', value: 'Church Innovation'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Summary Message',
      type: 'text',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'El Kratos Embassy',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'additionalImage',
      title: 'Additional Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'content',
      title: 'Blog Content',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'section',
          title: 'Section',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Content Paragraphs',
              type: 'array',
              of: [{type: 'text'}],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'quote',
              title: 'Quote (Optional)',
              type: 'text',
            }),
            defineField({
              name: 'list',
              title: 'List Items (Optional)',
              type: 'array',
              of: [
                {
                  type: 'string',
                },
              ],
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(2).max(3),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'featuredImage',
    },
    prepare({title, author, media}) {
      return {
        title: title,
        media: media,
        subtitle: author ? `by ${author}` : '',
      }
    },
  },
})
