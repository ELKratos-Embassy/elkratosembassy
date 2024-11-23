import Heading from '../ui/Heading';
import { home, section } from '@/constants';
import Cards from './Cards';

export default function WhatWeDo() {
  const {
    focus: {
      heading: { caption, text },
      cards,
    },
  } = home;
  return (
    <div className="flex flex-col gap-16">
      <Heading section={section.main} caption={caption} text={text} />
      <Cards cards={cards} />
    </div>
  );
}
