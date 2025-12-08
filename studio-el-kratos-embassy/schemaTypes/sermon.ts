import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sermon',
  title: 'Sermon',
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
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'text'}],
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'times',
      title: 'Service Times',
      type: 'array',
      of: [{type: 'string'}],
      initialValue: ['Sunday 9:00 AM WAT', 'Sunday 11:00 AM WAT'],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'array',
      of: [{type: 'string'}],
      initialValue: ['48, Ore-ofe community,', 'Onireke, Agbabiaka, Ilorin'],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Sermon',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Completed', value: 'completed'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
      },
      initialValue: 'upcoming',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      eventDate: 'eventDate',
      media: 'featuredImage',
    },
    prepare(selection) {
      const {eventDate} = selection
      return {
        ...selection,
        subtitle: new Date(eventDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
    },
  },
})
