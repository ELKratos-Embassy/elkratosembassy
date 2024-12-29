import { blogs } from '@/constants';
import React from 'react';

const {
  header: { text, caption },
} = blogs;
const BlogHeader = () => {
  return (
    <header className="text-center space-y-4">
      <h4 className="text-base uppercase">{caption}</h4>
      <h1 className="text-h2 uppercase">{text}</h1>
    </header>
  );
};

export default BlogHeader;
