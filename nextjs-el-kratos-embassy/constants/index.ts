import posts from './blogs';
import sermons from './sermons';
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
    heading: 'Where Spiritual Resilience Meets Life',
    'sub-heading': 'Welcome to El Kratos Embassy',
    btn: 'Learn More',
    caption:
      'A transformative faith community empowering believers through spiritual wisdom and practical solutions.',
  },
  focus: {
    heading: {
      caption: 'About Us',
      text: 'A church thats relevant',
    },
    cards: [
      {
        icon: '/cards/about-us.svg',
        heading: 'Our Vision',
        text: 'To be a beacon of transformation, where faith intersects with daily life, equipping believers to navigate challenges with spiritual resilience.',
      },
      {
        icon: '/cards/get-involved.svg',
        heading: 'Our Mission',
        text: 'Empowering believers to lead fulfilling lives by integrating spiritual wisdom with practical solutions, fostering discipline, and measuring growth.',
      },
      {
        icon: '/cards/giving-back.svg',
        heading: 'Our Values',
        text: 'We cultivate spiritual resilience, holistic growth, measured progress, and faith in action while maintaining professionalism and protecting privacy.',
      },
    ],
  },
  welcome: {
    heading: {
      caption: 'Our Purpose',
      text: 'Cultivating Holistic Growth',
    },
    message:
      'We are dedicated to cultivating a thriving community where members experience holistic growth in both their spiritual and personal lives, supported by a dynamic and technology-driven church environment. Through our unique Growth Cadar system, we foster disciplined spiritual development while recognizing individual achievements.',
    btn: 'Read more',
    galleryMobile: {
      src: '/welcome/gallery/gallery-mobile.png',
      alt: 'Praying in the church',
      width: 390,
      height: 512,
    },
    gallery: [
      {
        src: '/welcome/gallery/gallery-1.png',
        alt: 'Praying in the church',
        width: 293,
        height: 384,
      },
      {
        src: '/welcome/gallery/gallery-2.png',
        alt: 'Scripture reading',
        width: 390,
        height: 512,
      },
      {
        src: '/welcome/gallery/gallery-3.png',
        alt: 'Praying at the early hours of the morning',
        width: 293,
        height: 384,
      },
    ],
    footer: {
      caption: 'Our Mission & Vision',
      text: 'Transforming Lives Through Faith',
      message:
        'We are a beacon of transformation where faith intersects with daily life, equipping believers to navigate challenges with spiritual resilience. Our vision is to impact the world through intentional, measured, and disciplined growth, while our mission focuses on empowering believers to lead fulfilling lives.',
      btn: {
        text: 'Read More',
        icon: '/global/arrow-right.svg',
      },
    },
  },
  benefits: {
    heading: {
      caption: 'Our Core Values',
      text: 'The Benefits Of Joining Our Church',
    },
    cards: [
      {
        id: '1',
        caption: 'Spiritual Resilience',
        text: "Equip yourself with spiritual strength to navigate life's challenges through deep, personal faith and practical wisdom.",
        bg: {
          src: '/sermons/spiritual-resilience.png',
          alt: 'Spiritual Growth',
          width: 302,
          height: 384,
        },
      },
      {
        id: '2',
        caption: 'Holistic Growth',
        text: 'Experience balanced development in both spiritual and personal areas through our dynamic, technology-driven environment.',
        bg: {
          src: '/benefits/benefit-2.svg',
          alt: 'Personal Development',
          width: 302,
          height: 384,
        },
      },
      {
        id: '3',
        caption: 'Measured Progress',
        text: 'Track your spiritual journey through our unique Growth Cadar system, celebrating achievements and fostering disciplined growth.',
        bg: {
          src: '/benefits/benefit-3.svg',
          alt: 'Growth Tracking',
          width: 302,
          height: 384,
        },
      },
      {
        id: '4',
        caption: 'Community Support',
        text: 'Join a loving community that upholds privacy, maintains professionalism, and supports your journey through faith in action.',
        bg: {
          src: '/about/charity-events.png',
          alt: 'Community Support',
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
          id: '2',
          caption: 'Upcoming event',
          text: 'Spiritual Resilience in Daily Life',
          message:
            'Join us for an empowering sermon on integrating spiritual wisdom with practical solutions for everyday challenges.',
        },
        time: {
          icon: {
            src: '/sermons/clock.svg',
            alt: 'Clock',
            width: 20,
            height: 20,
          },
          text: ['Friday 10:30 AM', 'Saturday 11:20 AM'],
        },
        location: {
          icon: {
            src: '/sermons/location.svg',
            alt: 'Location',
            width: 20,
            height: 25,
          },
          text: ['48, Ore-ofe community, Onireke, Agbabiaka, Ilorin, Nigeria'],
        },
        btn: 'Register',
      },
    },
    bg: {
      src: '/sermons/spiritual-resilience.png',
      alt: 'Spiritual Resilience',
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
      text: 'Empowering Lives Through Faith',
      message:
        'Join our transformative faith community where spiritual resilience meets everyday life challenges.',
      btn: 'Join Us',
    },
    icon: {
      src: '/cta/quote.svg',
      alt: 'Quote icon',
      width: 187,
      height: 140,
    },
    bg: {
      src: '/cta/empowering-lives.png',
      alt: 'Church',
      width: 1500,
      height: 736,
    },
  },
  blog: {
    heading: {
      caption: 'Read our blog',
      text: 'Faith Meets Life',
    },
    posts: [
      {
        id: '1',
        caption: 'Spiritual Growth',
        text: 'Building Resilience Through Faith',
        message:
          "Discover how spiritual wisdom can help you navigate life's challenges with strength and purpose.",
        author: 'El Kratos Embassy',
        date: 'Tuesday 13 May, 2024',
      },
      {
        id: '2',
        caption: 'Community',
        text: 'Growing Together in Faith',
        message:
          'Learn about our unique Growth Cadar system and how it fosters measured spiritual development.',
        author: 'El Kratos Embassy',
        date: 'Tuesday 13 May, 2024',
      },
      {
        id: '3',
        caption: 'Faith in Action',
        text: 'Practical Applications of Faith',
        message:
          'Explore how to integrate spiritual wisdom with practical solutions in your daily life.',
        author: 'El Kratos Embassy',
        date: 'Tuesday 13 May, 2024',
      },
      {
        id: '4',
        caption: 'Technology & Faith',
        text: 'Modern Church in Digital Age',
        message:
          'See how we leverage technology to create a dynamic and engaging faith community.',
        author: 'El Kratos Embassy',
        date: 'Tuesday 13 May, 2024',
      },
    ],
  },
  footer: {
    left: {
      logo: '/footer/logo.svg',
      caption: '© Copyright El Kratos Embassy 2025',
      phoneNumber: '+2349060260210',
      address: '48, Ore-ofe community, Onireke, Agbabiaka, Ilorin, Nigeria',
      email: 'info@elkratosembassy.org',
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
          href: 'https://facebook.com/people/elkratosembassy/61573810487088',
        },
        {
          src: '/footer/twitter.svg',
          alt: 'Twitter',
          href: 'https://x.com/elkratosembassy',
        },
        {
          src: '/footer/linkedIn.svg',
          alt: 'LinkedIn',
          href: 'https://linkedin.com/company/elkratosembassy',
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
    text: 'Where Spiritual Resilience Meets Life',
  },
  welcome: [
    {
      heading: {
        caption: 'Our Mission & Vision',
        text: 'Transforming Lives Through Faith',
      },
      message:
        'We are a beacon of transformation where faith intersects with daily life, equipping believers to navigate challenges with spiritual resilience. Our vision is to impact the world through intentional, measured, and disciplined growth, while our mission focuses on empowering believers to lead fulfilling lives.',
    },
    {
      heading: {
        caption: 'What we do',
        text: 'Cultivating Holistic Growth',
      },
      message:
        'Through our dynamic, technology-driven environment, we support balanced development in both spiritual and personal areas. Our unique Growth Cadar system helps foster disciplined spiritual growth while recognizing individual achievements, all while maintaining privacy and professionalism.',
    },
  ],
  benefits: [
    {
      text: 'Spiritual Resilience',
      message:
        "We equip individuals with the spiritual strength needed to navigate life's challenges by nurturing a deep, personal faith and providing practical wisdom for daily living.",
      img: {
        src: '/sermons/spiritual-resilience.png',
        width: 500,
        height: 320,
      },
    },
    {
      text: 'Measured Growth',
      message:
        'Our Growth Cadar system provides a structured approach to spiritual development, allowing members to track their progress while celebrating achievements and fostering disciplined growth.',
      img: {
        src: '/about/shared-values.png',
        width: 500,
        height: 320,
      },
    },
    {
      text: 'Community Support',
      message:
        "We cultivate a culture of love and compassion, guided by Christ's example, to nurture each member's potential and foster unity while maintaining privacy and professional standards.",
      img: {
        src: '/about/charity-events.png',
        width: 500,
        height: 320,
      },
    },
    {
      text: 'Faith in Action',
      message:
        'We encourage members to apply spiritual wisdom in practical ways, empowering them to make a positive impact in their communities while embracing an online-centric approach to outreach and engagement.',
      img: {
        src: '/about/faith-in-action.png',
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
          src: '/about/team/yunus_habeeb.png',
        },
        name: 'Yunus Habeeb',
        post: 'Pastor',
        social: [
          // {
          //   src: '/about/team/social/fb.svg',
          //   href: '#',
          //   alt: 'Facebook',
          // },
          // {
          //   src: '/about/team/social/x.svg',
          //   href: '#',
          //   alt: 'X',
          // },
          {
            src: '/about/team/social/in.svg',
            href: 'https://linkedin.com/in/yunushabeeb',
            alt: 'LinkedIn',
          },
        ],
      },
      {
        img: {
          src: '/about/team/elizabeth_kuranga.png',
        },
        name: 'Elizabeth Kuranga',
        post: 'Assistant Pastor',
        social: [
          // {
          //   src: '/about/team/social/fb.svg',
          //   href: '#',
          //   alt: 'Facebook',
          // },
          // {
          //   src: '/about/team/social/x.svg',
          //   href: '#',
          //   alt: 'X',
          // },
          {
            src: '/about/team/social/in.svg',
            href: 'https://linkedin.com/in/elizabethkuranga',
            alt: 'LinkedIn',
          },
        ],
      },
      {
        img: {
          src: '/about/team/esther_kuranga.jpg',
        },
        name: 'Esther Kuranga',
        post: 'Chief Welfare Officer',
        social: [
          // {
          //   src: '/about/team/social/fb.svg',
          //   href: '#',
          //   alt: 'Facebook',
          // },
          // {
          //   src: '/about/team/social/x.svg',
          //   href: '#',
          //   alt: 'X',
          // },
          {
            src: '/about/team/social/in.svg',
            href: 'https://linkedin.com/in/estherkuranga',
            alt: 'LinkedIn',
          },
        ],
      },
      {
        img: {
          src: '/about/team/ezekiel_atanda.png',
        },
        name: 'Ezekiel Atanda',
        post: 'Chief Technical and Infrastructure Officer',
        social: [
          // {
          //   src: '/about/team/social/fb.svg',
          //   href: '#',
          //   alt: 'Facebook',
          // },
          // {
          //   src: '/about/team/social/x.svg',
          //   href: '#',
          //   alt: 'X',
          // },
          {
            src: '/about/team/social/in.svg',
            href: 'https://linkedin.com/in/oluwasegun-atanda-64597a23a',
            alt: 'LinkedIn',
          },
        ],
      },
      {
        img: {
          src: '/about/team/emmanuel_folorunsho.png',
        },
        name: 'Emmanuel Folorunsho',
        post: 'Chief Media Officer',
        social: [
          // {
          //   src: '/about/team/social/fb.svg',
          //   href: '#',
          //   alt: 'Facebook',
          // },
          // {
          //   src: '/about/team/social/x.svg',
          //   href: '#',
          //   alt: 'X',
          // },
          {
            src: '/about/team/social/in.svg',
            href: 'https://linkedin.com/in/emmanuel-folorunsho-888ba6236',
            alt: 'LinkedIn',
          },
        ],
      },
      {
        img: {
          src: '/about/team/alice_bamidele.png',
        },
        name: 'Alice Bamidele',
        post: 'Chief Finance Officer',
        social: [
          // {
          //   src: '/about/team/social/fb.svg',
          //   href: '#',
          //   alt: 'Facebook',
          // },
          // {
          //   src: '/about/team/social/x.svg',
          //   href: '#',
          //   alt: 'X',
          // },
          {
            src: '/about/team/social/in.svg',
            href: 'https://linkedin.com/in/ifedolapobamidele',
            alt: 'LinkedIn',
          },
        ],
      },
      {
        img: {
          src: '/about/team/rafiu_ayomide.png',
        },
        name: 'Zoe Rafiu',
        post: 'Chief Technology Officer',
        social: [
          // {
          //   src: '/about/team/social/fb.svg',
          //   href: '#',
          //   alt: 'Facebook',
          // },
          // {
          //   src: '/about/team/social/x.svg',
          //   href: '#',
          //   alt: 'X',
          // },
          {
            src: '/about/team/social/in.svg',
            href: 'https://linkedin.com/in/rafiuayomide',
            alt: 'LinkedIn',
          },
        ],
      }
    ],
  },
};

export const sermon = {
  heading: {
    caption: 'Sermons',
    text: 'Growing Together in Faith and Understanding',
  },
  events: {
    title: 'View All Events',
    data: sermons,
  },
};

export const blogs = {
  header: {
    caption: 'Our Blog',
    text: 'Faith Meets Life',
  },

  posts: {
    title: 'All blog posts',
    data: posts,
  },
};

export const contact = {
  hero: {
    caption: 'Contact',
    text: 'Connect with El Kratos Embassy',
  },
  address: {
    location: '48, Ore-ofe community, Onireke, Agbabiaka, Ilorin, Nigeria',
    phone: '+2349060260210',
    email: 'info@elkratosembassy.org',
  },
  social: [
    {
      src: '/contact/fb.png',
      alt: 'Facebook',
      href: 'https://facebook.com/people/elkratosembassy/61573810487088',
    },
    {
      src: '/contact/x.png',
      alt: 'X',
      href: 'https://x.com/elkratosembassy',
    },
    {
      src: '/contact/in.png',
      alt: 'LinkedIn',
      href: 'https://linkedin.com/company/elkratosembassy',
    },
  ],
};
