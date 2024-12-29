enum section {
  main = 2,
  gallery = 4,
  sermon = 5,
}

// declare interface section {
//   main: section.main;
//   gallery: section.gallery;
//   sermon: section.sermon;
// }

// declare interface ButtonProps {
//   text: string;
//   variant: 'primary' | 'secondary' | 'nav' | false;
// }
declare interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'nav';
  icon?: string;
}
declare interface CardProps {
  icon: string;
  heading: string;
  text: string;
}
declare interface CardsProps {
  cards: CardProps[];
}

declare interface HeadingProps {
  caption: string;
  text: string;
  section?: section.main | section.sermon | section.gallery;
  about?: boolean;
  hero?: boolean;
}

declare interface PostProps {
  post: {
    id: string;
    caption: string;
    text: string;
    message: string;
    author: string;
    date: string;
  };
}
