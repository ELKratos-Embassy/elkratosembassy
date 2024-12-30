export const links = [
  {
    text: 'Home',
    href: '/',
  },
  {
    text: 'About Us',
    href: '/about-us',
  },
  {
    text: 'Sermon',
    href: '/sermons',
  },
  {
    text: 'Blog',
    href: '/blogs',
  },
  {
    text: 'Contact Us',
    href: '/contact-us',
  },
];

export const section = {
  main: 2,
  gallery: 4,
  sermon: 5,
};
export const home = {
  hero: {
    heading: 'Become a part of our community',
    'sub-heading': 'Welcome to our church',
    btn: 'Learn More',
    caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
  },
  focus: {
    heading: {
      caption: 'SubHeading',
      text: 'A church thats relevant',
    },
    cards: [
      {
        icon: '/cards/about-us.svg',
        heading: 'About Us',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        icon: '/cards/get-involved.svg',
        heading: 'Get Involved',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        icon: '/cards/giving-back.svg',
        heading: 'Giving Back',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
    ],
  },
  welcome: {
    heading: {
      caption: 'Sub headline',
      text: 'Love and compassion',
    },
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    btn: 'Read more',
    gallery: [
      {
        src: '/welcome/gallery/gallery-1.svg',
        alt: 'A man praying',
        width: 293,
        height: 384,
      },
      {
        src: '/welcome/gallery/gallery-2.svg',
        alt: 'Scripture reading',
        width: 390,
        height: 512,
      },
      {
        src: '/welcome/gallery/gallery-3.svg',
        alt: 'Laying of hands',
        width: 293,
        height: 384,
      },
    ],
    footer: {
      caption: 'Our mission & vision',
      text: 'celebrate with us',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      btn: {
        text: 'Read More',
        icon: '/global/arrow-right.svg',
      },
    },
  },
  benefits: {
    heading: {
      caption: 'Watch And Listen',
      text: 'The Benefits Of Joining Our Church',
    },
    cards: [
      {
        id: '1',
        caption: 'Watch And Listen To Our Sermons',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.',
        bg: {
          src: '/benefits/benefit-1.svg',
          alt: 'Praying with rossery',
          width: 302,
          height: 384,
        },
      },
      {
        id: '2',
        caption: 'Watch And Listen To Our Sermons',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.',
        bg: {
          src: '/benefits/benefit-2.svg',
          alt: 'Bible with a cross',
          width: 302,
          height: 384,
        },
      },
      {
        id: '3',
        caption: 'Watch And Listen To Our Sermons',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.',
        bg: {
          src: '/benefits/benefit-3.svg',
          alt: 'A Bishop Reading The Bible',
          width: 302,
          height: 384,
        },
      },
      {
        id: '4',

        caption: 'Watch And Listen To Our Sermons',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.',
        bg: {
          src: '/benefits/benefit-4.svg',
          alt: 'Birth Of Jesus',
          width: 302,
          height: 384,
        },
      },
    ],
  },
  sermons: {
    heading: {
      caption: 'Upcoming Sermons',
      text: 'Join Us And Become Part Of Something Great',
    },
    card: {
      date: {
        caption: '20',
        text: 'July',
      },
      info: {
        desc: {
          caption: 'Upcoming event',
          text: 'Watch and listen to our sermons',
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
        },
        time: {
          icon: {
            src: '/sermons/clock.svg',
            alt: 'Clock',
            width: 20,
            height: 20,
          },
          text: ['Friday 23:39 IST', 'Saturday 11:20 ISD'],
        },
        location: {
          icon: {
            src: '/sermons/location.svg',
            alt: 'Location',
            width: 20,
            height: 25,
          },
          text: ['No 233 Main St. New York,', 'United States'],
        },
        btn: 'Register',
      },
    },
    bg: {
      src: '/sermons/bg.svg',
      alt: 'A woman and a man in black and white',
      width: 845,
      height: 512,
    },
    btn: {
      text: 'View all sermons',
      icon: '/global/arrow-right.svg',
    },
  },
  cta: {
    card: {
      text: 'We want to serve the world around us',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
      btn: 'Visit',
    },
    icon: {
      src: '/cta/quote.svg',
      alt: 'Quote icon',
      width: 187,
      height: 140,
    },
    bg: {
      src: '/cta/bg.svg',
      alt: 'Church',
      width: 1500,
      height: 736,
    },
  },
  blog: {
    heading: {
      caption: 'Read our blog',
      text: 'Share, inspire, innovate',
    },
    posts: [
      {
        id: 'item-1',
        caption: 'Relationship',
        text: 'Watch and listen to our sermons',
        message:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
        author: 'By Matthew Johnson',
        date: 'Tuesday 13 May, 2021',
      },
      {
        id: 'item-2',
        caption: 'Relationship',
        text: 'Watch and listen to our sermons',
        message:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
        author: 'By Matthew Johnson',
        date: 'Tuesday 13 May, 2021',
      },
      {
        id: 'item-3',
        caption: 'Relationship',
        text: 'Watch and listen to our sermons',
        message:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
        author: 'By Matthew Johnson',
        date: 'Tuesday 13 May, 2021',
      },
      {
        id: 'item-4',
        caption: 'Relationship',
        text: 'Watch and listen to our sermons',
        message:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
        author: 'By Matthew Johnson',
        date: 'Tuesday 13 May, 2021',
      },
    ],
  },
  footer: {
    left: {
      // logo: "/logo.png",
      logo: '/footer/logo.svg',
      caption: '© Copyright Finsweet 2022',
      phoneNumber: '(480) 555-0103',
      address: '4517 Washington Ave.',
      email: 'finsweet@example.com',
    },
    quicklinks: {
      text: 'Quicklinks',
      nav: [
        {
          text: 'About Us',
          href: '/about-us',
        },
        {
          text: 'Sermons',
          href: '/sermons',
        },
        {
          text: 'Events',
          href: '/events',
        },
        {
          text: 'Blog',
          href: '/blogs',
        },
      ],
    },
    connect: {
      text: 'Connect',
      icons: [
        {
          src: '/footer/facebook.svg',
          alt: 'Facebook',
          href: 'https://fb.com/elkratosembassy',
        },
        {
          src: '/footer/twitter.svg',
          alt: 'Twitter',
          href: 'https://x.com/elkratosembassy',
        },
        {
          src: '/footer/linkedIn.svg',
          alt: 'LinkedIn',
          href: 'https://linkedin.com/elkratosembassy',
        },
      ],
    },
    subscribe: {
      text: 'Subscribe to get latest updates and news',
      form: {
        input: {
          label: 'Email Address',
          placeholder: 'Yourmail@gmail.com',
        },
        btn: {
          text: 'Subscribe',
        },
      },
    },
  },
};

export const aboutUs = {
  heading: {
    caption: 'About us',
    text: 'Serving the world around us',
  },
  welcome: [
    {
      heading: {
        caption: 'Our Mission & Vision',
        text: 'Striving for a better tomorrow',
      },
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    },
    {
      heading: {
        caption: 'What we do',
        text: 'Bringing peace and joy to the world',
      },
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    },
  ],
  benefits: [
    {
      text: 'Find fulfillment and joy',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
      img: {
        src: '/about/fulfillment.png',
        width: 500,
        height: 320,
      },
    },
    {
      text: 'Shared values',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
      img: {
        src: '/about/shared-values.png',
        width: 500,
        height: 320,
      },
    },
    {
      text: 'Charity events',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
      img: {
        src: '/about/charity-events.png',
        width: 500,
        height: 320,
      },
    },
    {
      text: 'All are welcome',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
      img: {
        src: '/about/all-are-welcome.png',
        width: 500,
        height: 320,
      },
    },
  ],
  team: {
    heading: {
      text: 'Meet our Inspirational Team',
      caption: 'Church Members',
    },
    cards: [
      {
        img: {
          src: '/about/team/kim-bowen.png',
        },
        name: 'Kim Bowen',
        post: 'Pastor, Church',
        social: [
          {
            src: '/about/team/social/fb.svg',
            href: 'https://fb.com/kim',
            alt: 'Facebook',
          },
          {
            src: '/about/team/social/x.svg',
            href: 'https://x.com/kim',
            alt: 'X',
          },
          {
            src: '/about/team/social/in.svg',
            href: 'https://in.com/kim',
            alt: 'LinkedIn',
          },
        ],
      },
      {
        img: {
          src: '/about/team/danielle-watkins.png',
        },
        name: 'Danielle Watkins',
        post: 'Pastor, Church',
        social: [
          {
            src: '/about/team/social/fb.svg',
            href: 'https://fb.com/dan',
            alt: 'Facebook',
          },
          {
            src: '/about/team/social/x.svg',
            href: 'https://x.com/dan',
            alt: 'X',
          },
          {
            src: '/about/team/social/in.svg',
            href: 'https://in.com/dan',
            alt: 'LinkedIn',
          },
        ],
      },
      {
        img: {
          src: '/about/team/naomi-craig.png',
        },
        name: 'Naomi Craig',
        post: 'Pastor, Church',
        social: [
          {
            src: '/about/team/social/fb.svg',
            href: 'https://fb.com/naomi',
            alt: 'Facebook',
          },
          {
            src: '/about/team/social/x.svg',
            href: 'https://x.com/naomi',
            alt: 'X',
          },
          {
            src: '/about/team/social/in.svg',
            href: 'https://in.com/naomi',
            alt: 'LinkedIn',
          },
        ],
      },
      {
        img: {
          src: '/about/team/santos-payne.png',
        },
        name: 'Santos Payne',
        post: 'Pastor, Church',
        social: [
          {
            src: '/about/team/social/fb.svg',
            href: 'https://fb.com/santos',
            alt: 'Facebook',
          },
          {
            src: '/about/team/social/x.svg',
            href: 'https://x.com/santos',
            alt: 'X',
          },
          {
            src: '/about/team/social/in.svg',
            href: 'https://in.com/santos',
            alt: 'LinkedIn',
          },
        ],
      },
    ],
  },
};

export const sermon = {
  heading: {
    caption: 'Sermon',
    text: 'Take part in our sermon',
  },
};

export const blogs = {
  header: {
    caption: 'Our Blog',
    text: 'MOst Recent Post',
  },
  hero: {
    image: '/blogs/hero.png',
    date: 'Tuesday 13 May, 2022',
    author: 'John Hunau Deo',
    text: 'Church was doing what he often did when dropped an Oracle',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.',
    btn: 'Read more',
  },
  posts: {
    title: 'All blog posts',
    data: [
      {
        id: '1',
        tag: 'Relationship',
        title: 'The best way to inspire people',
        message:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',

        author: 'Mathew Johnson',
        date: 'Tuesday 13 May, 2018',

        detail: {
          image: [
            '/blogs/how-to-show-compassion.png',
            '/blogs/show-compassion-2.png',
          ],
          post: [
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
              ],
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
              ],
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui faucibus in ornare quam viverra orci sagittis eu volutpat.',
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR',
              content: [
                'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want to serve the world around us. It’s why we support mission work all across the globe Regardless of what your next step in faith is, we want to help you take that next step Our church is10% of our annual income to',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Saepe magni aut maxime vel voluptatem. Ab eveniet neque placeat qui porro ab minus voluptas. Dicta praesentium neque vero mollitia aperiam sed enim. Lacinia quis vel eros donec ac odio.',
              ],
              list: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing',
                'Purus sit amet luctus venenatis lectus magna',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod',
              ],
            },
          ],
        },
      },
      {
        id: '2',
        tag: 'Relationship',
        title: 'How to show compassion',
        message:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',

        author: 'Mathew Johnson',
        date: 'Tuesday 13 May, 2018',
        detail: {
          image: [
            '/blogs/how-to-show-compassion.png',
            '/blogs/show-compassion-2.png',
          ],
          post: [
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
              ],
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
              ],
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui faucibus in ornare quam viverra orci sagittis eu volutpat.',
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR',
              content: [
                'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want to serve the world around us. It’s why we support mission work all across the globe Regardless of what your next step in faith is, we want to help you take that next step Our church is10% of our annual income to',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Saepe magni aut maxime vel voluptatem. Ab eveniet neque placeat qui porro ab minus voluptas. Dicta praesentium neque vero mollitia aperiam sed enim. Lacinia quis vel eros donec ac odio.',
              ],
              list: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing',
                'Purus sit amet luctus venenatis lectus magna',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod',
              ],
            },
          ],
        },
      },
      {
        id: '3',
        tag: 'Relationship',
        title: 'The biblical purpose of money',
        message:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',

        author: 'Mathew Johnson',
        date: 'Tuesday 13 May, 2018',
        detail: {
          image: [
            '/blogs/how-to-show-compassion.png',
            '/blogs/show-compassion-2.png',
          ],
          post: [
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
              ],
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
              ],
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui faucibus in ornare quam viverra orci sagittis eu volutpat.',
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR',
              content: [
                'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want to serve the world around us. It’s why we support mission work all across the globe Regardless of what your next step in faith is, we want to help you take that next step Our church is10% of our annual income to',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Saepe magni aut maxime vel voluptatem. Ab eveniet neque placeat qui porro ab minus voluptas. Dicta praesentium neque vero mollitia aperiam sed enim. Lacinia quis vel eros donec ac odio.',
              ],
              list: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing',
                'Purus sit amet luctus venenatis lectus magna',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod',
              ],
            },
          ],
        },
      },
      {
        id: '4',
        tag: 'Relationship',
        title: 'The best way to inspire people',
        message:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',

        author: 'Mathew Johnson',
        date: 'Tuesday 13 May, 2018',
        detail: {
          image: [
            '/blogs/how-to-show-compassion.png',
            '/blogs/show-compassion-2.png',
          ],
          post: [
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
              ],
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
              ],
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui faucibus in ornare quam viverra orci sagittis eu volutpat.',
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR',
              content: [
                'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want to serve the world around us. It’s why we support mission work all across the globe Regardless of what your next step in faith is, we want to help you take that next step Our church is10% of our annual income to',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Saepe magni aut maxime vel voluptatem. Ab eveniet neque placeat qui porro ab minus voluptas. Dicta praesentium neque vero mollitia aperiam sed enim. Lacinia quis vel eros donec ac odio.',
              ],
              list: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing',
                'Purus sit amet luctus venenatis lectus magna',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod',
              ],
            },
          ],
        },
      },
      {
        id: '5',
        tag: 'Relationship',
        title: 'What it means to be a discipline',
        message:
          'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want...',

        author: 'Mathew Johnson',
        date: 'Tuesday 13 May, 2018',
        detail: {
          image: [
            '/blogs/how-to-show-compassion.png',
            '/blogs/show-compassion-2.png',
          ],
          post: [
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
              ],
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
              ],
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui faucibus in ornare quam viverra orci sagittis eu volutpat.',
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR',
              content: [
                'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want to serve the world around us. It’s why we support mission work all across the globe Regardless of what your next step in faith is, we want to help you take that next step Our church is10% of our annual income to',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Saepe magni aut maxime vel voluptatem. Ab eveniet neque placeat qui porro ab minus voluptas. Dicta praesentium neque vero mollitia aperiam sed enim. Lacinia quis vel eros donec ac odio.',
              ],
              list: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing',
                'Purus sit amet luctus venenatis lectus magna',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod',
              ],
            },
          ],
        },
      },
      {
        id: '6',
        tag: 'Relationship',
        title: 'What it means to be a discipline',
        message:
          'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want...',

        author: 'Mathew Johnson',
        date: 'Tuesday 13 May, 2018',
        detail: {
          image: [
            '/blogs/how-to-show-compassion.png',
            '/blogs/show-compassion-2.png',
          ],
          post: [
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
              ],
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
              ],
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui faucibus in ornare quam viverra orci sagittis eu volutpat.',
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR',
              content: [
                'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want to serve the world around us. It’s why we support mission work all across the globe Regardless of what your next step in faith is, we want to help you take that next step Our church is10% of our annual income to',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Saepe magni aut maxime vel voluptatem. Ab eveniet neque placeat qui porro ab minus voluptas. Dicta praesentium neque vero mollitia aperiam sed enim. Lacinia quis vel eros donec ac odio.',
              ],
              list: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing',
                'Purus sit amet luctus venenatis lectus magna',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod',
              ],
            },
          ],
        },
      },
      {
        id: '7',
        tag: 'Relationship',
        title: 'What it means to be a believe',
        message:
          'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want...',

        author: 'Mathew Johnson',
        date: 'Tuesday 13 May, 2018',
        detail: {
          image: [
            '/blogs/how-to-show-compassion.png',
            '/blogs/show-compassion-2.png',
          ],

          post: [
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
              ],
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
              ],
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui faucibus in ornare quam viverra orci sagittis eu volutpat.',
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR',
              content: [
                'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want to serve the world around us. It’s why we support mission work all across the globe Regardless of what your next step in faith is, we want to help you take that next step Our church is10% of our annual income to',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Saepe magni aut maxime vel voluptatem. Ab eveniet neque placeat qui porro ab minus voluptas. Dicta praesentium neque vero mollitia aperiam sed enim. Lacinia quis vel eros donec ac odio.',
              ],
              list: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing',
                'Purus sit amet luctus venenatis lectus magna',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod',
              ],
            },
          ],
        },
      },
      {
        id: '8',
        tag: 'Relationship',
        title: 'The modern church in 2022',
        message:
          'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want...',

        author: 'Mathew Johnson',
        date: 'Tuesday 13 May, 2018',
        detail: {
          image: [
            '/blogs/how-to-show-compassion.png',
            '/blogs/show-compassion-2.png',
          ],

          post: [
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
              ],
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET',
              content: [
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta lorem mollis aliquam. Quis vel eros donec ac odio tempor orci dapibus ultrices. Elementum eu facilisis sed odio morbi. Nam at lectus urna duis convallis convallis tellus id. Feugiat pretium nibh ipsum consequat nisl vel. Elementum pulvinar etiam non quam lacus. Sit amet porttitor eget.',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
              ],
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui faucibus in ornare quam viverra orci sagittis eu volutpat.',
            },
            {
              title: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR',
              content: [
                'We both celebrate and challenge the culture around us as we orient our lives around Jesus. We want to serve the world around us. It’s why we support mission work all across the globe Regardless of what your next step in faith is, we want to help you take that next step Our church is10% of our annual income to',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Non tellus orci ac auctor augue mauris augue neque gravida.',
                'Saepe magni aut maxime vel voluptatem. Ab eveniet neque placeat qui porro ab minus voluptas. Dicta praesentium neque vero mollitia aperiam sed enim. Lacinia quis vel eros donec ac odio.',
              ],
              list: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing',
                'Purus sit amet luctus venenatis lectus magna',
                'Aenean vel elit scelerisque mauris. Imperdiet sed euismod',
              ],
            },
          ],
        },
      },
    ],
  },
};

export const contact = {
  hero: {
    caption: 'Contact',
    text: 'Get in touch with our church',
  },
  address: {
    location: 'NH 234 Public Square San Francisco 65368',
    phone: '(480) 555-0103',
    email: 'Finsweet@example.com',
  },
  social: [
    {
      src: '/contact/fb.png',
      alt: 'Facebook',
      href: 'https://fb.com/elkratosembassy',
    },
    {
      src: '/contact/x.png',
      alt: 'X',
      href: 'https://x.com/elkratosembassy',
    },
    {
      src: '/contact/in.png',
      alt: 'LinkedIn',
      href: 'https://linkedin.com/elkratosembassy',
    },
  ],
};
