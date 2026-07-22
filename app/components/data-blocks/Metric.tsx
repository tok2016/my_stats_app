type MetricProps = {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Metric({
  id,
  title,
  children,
  className = ''
}: MetricProps) {
  return (
    <section id={id} className={`metric ${className}`}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}
