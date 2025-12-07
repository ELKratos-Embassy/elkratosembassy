export default {
  name: 'sermon',
  title: 'Sermon',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Sermon Title',
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
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'text' }],
      validation: (Rule: any) => Rule.required().min(1).max(3),
    },
    {
      name: 'eventDate',
      title: 'Event Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'times',
      title: 'Service Times',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Sunday 9:00 AM WAT', 'Sunday 11:00 AM WAT'],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['48, Ore-ofe community,', 'Onireke, Agbabiaka, Ilorin'],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'featured',
      title: 'Featured Sermon',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'upcoming',
    },
  ],
  preview: {
    select: {
      title: 'title',
      eventDate: 'eventDate',
      media: 'featuredImage',
    },
    prepare(selection: any) {
      const { eventDate } = selection
      return Object.assign({}, selection, {
        subtitle: eventDate && new Date(eventDate).toLocaleDateString(),
      })
    },
  },
}