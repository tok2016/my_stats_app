import Skeleton from '@components/Skeleton';

export default function CountryDataSkeleton() {
  return (
    <div className='country'>
      <Skeleton type='text' width='5rem' />
      <Skeleton type='image' className='flag' />
    </div>
  );
}
