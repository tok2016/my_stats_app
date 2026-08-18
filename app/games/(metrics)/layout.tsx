import PageName from '@components/profile-layout/PageName';

import RefreshButtons from './RefreshButtons';
import './games-metrics.scss';

export default function GamesMetricLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className='games-page-name'>
        <PageName />
        <RefreshButtons />
      </div>

      <div className='metrics'>{children}</div>
    </>
  );
}
