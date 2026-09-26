import Link from 'next/link';

/**
 * @returns Link to login page.
 */
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
