type HintProps = {
  variant?: 'regular' | 'error';
  children?: React.ReactNode;
};

export default function Hint({ variant = 'regular', children }: HintProps) {
  if (!children) {
    return;
  }

  return <div className={`hint ${variant}`}>{children}</div>;
}
