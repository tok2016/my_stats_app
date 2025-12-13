type SpinnerProps = {
  className?: string;
  size?: string | number;
  strokeWidth?: string | number;
};

export default function Spinner({
  className,
  size,
  strokeWidth
}: SpinnerProps) {
  return (
    <div
      className={`spinner ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}rem` : size,
        borderWidth:
          typeof strokeWidth === 'number' ? `${strokeWidth}px` : strokeWidth
      }}
    ></div>
  );
}
