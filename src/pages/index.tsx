import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Game from "~/components/Game";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Science Based 100% Dragon MMO</title>
        <meta name="description" content="Science Based 100% Dragon MMO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex grow flex-col items-center text-white gap-40 mt-4 select-none">
          <h1 className="text-4xl">Science Based 100% Dragon MMO (Monotonous Metacarpal Offender)</h1>
          <Game />
        </div>
      </main>
    </>
  );
};

export default Home;
