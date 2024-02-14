import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

function Header() {
  return (
    <header>
      <div
        className="flex justify-between items-center bg-black px-12 py-4 text-white
       text-[0.8em] sm:text-[1em] md:text-[1.2em]"
      >
        <Link href="/">COP WITH TEXT</Link>
        <div className="flex justify-center items-center gap-16">
          <div className="mint-button-header rounded-sm">
            <Link href="/mint">MINT</Link>
          </div>
          <div className="hidden sm:block connect-wallet-header">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
