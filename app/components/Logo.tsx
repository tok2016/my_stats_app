import Link from 'next/link';

type LogoProps = {
  variant?: 'h1' | 'h2' | 'h3';
  className?: string;
};

export default function Logo({ variant = 'h1', className = '' }: LogoProps) {
  return (
    <Link href='/' className={`logo ${variant} ${className}`}>
      My_Stats
    </Link>
  );
}
