type PropBlockProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function PropBlock({
  title,
  className = '',
  children
}: PropBlockProps) {
  return (
    <div className={`prop-block ${className}`}>
      <p className='prop-block-title'>{title}: </p>
      {children}
    </div>
  );
}
