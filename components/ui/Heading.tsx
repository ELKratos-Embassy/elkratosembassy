import { section } from '@/constants';
import clsx from 'clsx';

export default function Heading({
  caption,
  text,
  section: state,
  about,
}: HeadingProps) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-4 justify-center mx-auto max-w-[750px]',

        about ? 'text-left' : 'text-center',
      )}
    >
      {state === section.main ? (
        <>
          <p className="uppercase">{caption}</p>
          <h2 className="text-h2 text-black">{text}</h2>
        </>
      ) : state === section.gallery ? (
        <>
          <p className="uppercase">{caption}</p>
          <h4 className="text-h4 text-black">{text}</h4>
        </>
      ) : (
        <div className="space-y-4 text-left">
          <p className="text-[12px] font-bold text-transparent bg-clip-text bg-linear-to-r from-gradient-100 to-gradient-200 uppercase">
            {caption}
          </p>
          <h5 className="text-h5 text-left text-black font-bold">{text}</h5>
        </div>
      )}
    </div>
  );
}
