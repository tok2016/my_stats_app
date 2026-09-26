type PropBlockProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * @param props
 * @param props.title - Title of prop.
 * @param props.className
 * @param props.children - Content of prop.
 * @returns Block for prop with title and given content.
 */
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
