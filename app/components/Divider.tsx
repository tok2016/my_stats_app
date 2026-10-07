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
      className={`divider ${rounded ? 'divider--rounded' : ''} ${colored ? 'colored' : ''} ${className}`}
    >
      <div className='divider__left-hand'></div>
      {children}
      <div className='divider__right-hand'></div>
    </div>
  );
}
