export default function Heading({ caption, text, variant }: HeadingProps) {
  return (
    <div className="flex flex-col gap-4 justify-center text-center">
      {/* <h1 className="text-h1 text-center my-5">{children}</h1>; */}
      <p>{caption.toUpperCase()}</p>
      {variant ? (
        <h4 className="text-h4 text-black">{text}</h4>
      ) : (
        <h2 className="text-h2 text-black">{text}</h2>
      )}
    </div>
  );
}
