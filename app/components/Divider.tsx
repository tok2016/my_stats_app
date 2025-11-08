type DividerProps = {
  children?: React.ReactNode;
  rounded?: boolean;
};

export default function Divider({ children, rounded }: DividerProps) {
  return (
    <div className={`divider ${rounded ? 'rounded' : ''}`}>
      <div className='left'></div>
      {children}
      <div className='right'></div>
    </div>
  );
}
