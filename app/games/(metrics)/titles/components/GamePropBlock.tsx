type GamePropBlockProps = {
  title: string;
  children: React.ReactNode;
};

export default function GamePropBlock({ title, children }: GamePropBlockProps) {
  return (
    <div className='game-prop-block'>
      <span>{title}: </span>
      <br />
      {children}
    </div>
  );
}
