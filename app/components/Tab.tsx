import Drawer from './Drawer';

type TabProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export default function Tab({ label, className, children }: TabProps) {
  return (
    <Drawer label={<h3>{label}</h3>} className={`tab ${className}`}>
      {children}
    </Drawer>
  );
}
