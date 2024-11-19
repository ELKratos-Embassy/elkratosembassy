declare interface ButtonProps {
  text: string;
  variant: 'primary' | 'secondary' | 'nav' | false;
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
  variant?: string;
}
