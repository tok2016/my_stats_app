import Drawer from './Drawer';

type TabProps = {
  label: string;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function Tab({ label, loading, className, children }: TabProps) {
  return (
    <Drawer
      label={<h3>{label}</h3>}
      loading={loading}
      className={`tab ${className}`}
    >
      {children}
    </Drawer>
  );
}
