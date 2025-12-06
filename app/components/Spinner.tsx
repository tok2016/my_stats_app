type SpinnerProps = {
  size?: string | number;
  strokeWidth?: string | number;
};

export default function Spinner({ size, strokeWidth }: SpinnerProps) {
  return (
    <div
      className='spinner'
      style={{
        width: typeof size === 'number' ? `${size}rem` : size,
        borderWidth:
          typeof strokeWidth === 'number' ? `${strokeWidth}px` : strokeWidth
      }}
    ></div>
  );
}
