import Link from 'next/link';

export default function GamesMainPage() {
  // return (
  //   <>
  //     <Link href='/games/genres'>Genres</Link>
  //     <Link href='/games/studios'>Developers & Publishers</Link>
  //     <Link href='/games/platforms'>Platforms</Link>
  //     <Link href='/games/titles'>Video Games</Link>
  //     <Link href='/games/library'>Library</Link>
  //   </>
  // );

  return (
    <>
      <Link href='/games/test/doughnut'>Dougnut</Link>
      <Link href='/games/test/bar'>Bar</Link>
      <Link href='/games/test/line'>Line</Link>
      <Link href='/games/test/periodBar'>Period Bar</Link>
    </>
  );
}
