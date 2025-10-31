import Link from 'next/link';

export default function Reminder() {
  return (
    <span>
      Remembered password?{' '}
      <Link href='/login' className='bold colored underline'>
        Sign in!
      </Link>
    </span>
  );
}
