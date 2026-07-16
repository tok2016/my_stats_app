type DividerProps = {
  children?: React.ReactNode;
  rounded?: boolean;
  className?: string;
  colored?: boolean;
};

export default function Divider({
  children,
  rounded,
  className = '',
  colored = false
}: DividerProps) {
  return (
    <div
      className={`divider ${rounded ? 'rounded' : ''} ${colored ? 'colored' : ''} ${className}`}
    >
      <div className='left-hand'></div>
      {children}
      <div className='right-hand'></div>
    </div>
  );
}
