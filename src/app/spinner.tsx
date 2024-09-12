import { ComponentPropsWithoutRef } from 'react';

export default function Spinner({
  className,
  ...rest
}: ComponentPropsWithoutRef<'span'>) {
  return (
    <span className={`block relative opacity-[.65] ${className}`} {...rest}>
      {Array.from(Array(8).keys()).map((i) => (
        <span
          key={i}
          className="absolute top-0 left-[calc(50%-12.5%/2)] w-[12.5%] h-[100%] before:block before:w-[100%] before:h-[30%] before:rounded-full before:bg-black animate-[spinner_800ms_linear_infinite]"
          style={{
            transform: `rotate(${45 * i}deg)`,
            animationDelay: `calc(-${8 - i} / 8 * 800ms)`,
          }}
        />
      ))}
    </span>
  );
}
