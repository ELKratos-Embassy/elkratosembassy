import Image from 'next/image';

export default function Cards({ cards }: CardsProps) {
  return (
    <div className="flex flex-col max-md:flex-wrap sm:flex-row gap-6 justify-center lg:gap-12">
      {cards.map(({ icon, heading, text }) => (
        <div
          key={icon}
          className="relative flex flex-col justify-between bg-light-orange transition-transform duration-300 hover:scale-105 hover:shadow-xl rounded-lg shadow-md w-full max-w-sm md:w-72 lg:w-1/3 text-center overflow-hidden"
        >
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 z-0"></div>

          {/* Card Content */}
          <div className="relative z-10 flex flex-col gap-4 p-6 sm:p-10 md:p-16">
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

          {/* Bottom Divider Line */}
          <div className="bg-primary h-2 transition-transform duration-300 group-hover:translate-y-1 rounded-b-lg"></div>
        </div>
      ))}
    </div>
  );
}
