import Image from 'next/image';

export default function Cards({ cards }: CardsProps) {
  return (
    <div className="flex flex-col flex-wrap  sm:flex-row gap-6 sm:gap-10 justify-center lg:gap-6 mx-auto">
      {cards.map(({ icon, heading, text }) => (
        <div
          key={icon}
          className="relative flex flex-col justify-between bg-light-orange  duration-300 hover:scale-105 hover:shadow-xl rounded-lg shadow-md w-full max-w-sm sm:w-64 lg:w-72 text-center overflow-hidden hover:border-b-[16px] border-primary transition-all"
        >
          {/* Hover Overlay */}
          {/* <div className="absolute inset-0 bg-red-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 z-0"></div> */}

          {/* Card Content */}
          <div className="relative z-10 flex flex-col gap-4 p-10 sm:p-6 md:py-8">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-primary flex justify-center items-center mx-auto">
              <Image src={icon} width={22} height={22} alt={text} />
            </div>

            {/* Heading and Text */}
            <div className="text-center space-y-2">
              <h4 className="text-lg font-bold md:text-xl lg:text-2xl">
                {heading}
              </h4>
              <p className="text-sm md:text-base text-gray-700">{text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
