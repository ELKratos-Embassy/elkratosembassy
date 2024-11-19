import Image from 'next/image';
import React from 'react';

export default function Cards({ cards }: CardsProps) {
  return (
    <div className="flex flex-col max-md:flex-wrap sm:flex-row gap-6 justify-center lg:gap-12">
      {cards.map(({ icon, heading, text }) => (
        <div
          key={icon}
          className="flex flex-col flex-wrap justify-between bg-light-orange transition-transform duration-200 hover:scale-105 rounded-lg shadow-md w-full md:max-w-96 sm:w-64 md:w-72 lg:w-1/3 text-center"
        >
          {/* Card Content */}
          <div className="flex flex-col gap-4 p-6 sm:p-10 md:p-16">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-primary flex justify-center items-center mx-auto md:mx-0">
              <Image src={icon} width={22} height={22} alt={text} />
            </div>

            {/* Heading and Text */}
            <div className="text-center md:text-left space-y-2">
              <h4 className="text-lg font-bold md:text-xl lg:text-2xl">
                {heading}
              </h4>
              <p className="text-sm md:text-base text-gray-700">{text}</p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="bg-primary h-2 rounded-b-lg"></div>
        </div>
      ))}
    </div>
  );
}
