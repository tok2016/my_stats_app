type HintProps = {
  variant?: 'regular' | 'error';
  children?: React.ReactNode;
};

export default function Hint({ variant = 'regular', children }: HintProps) {
  return <div className={`hint ${variant}`}>{children}</div>;
}
