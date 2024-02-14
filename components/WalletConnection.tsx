import { ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  UnsafeBurnerWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const RPC_ENDPOINT_URL = process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL;
let endpoint: string = "";

if (RPC_ENDPOINT_URL !== undefined) {
  endpoint = RPC_ENDPOINT_URL;
} else {
  throw new Error("RPC_ENDPOINT is not defined. Please provide NEXT_PUBLIC_RPC_ENDPOINT_URL env variable.");
}

const WalletConnection = ({ children }: { children: ReactNode }) => {
  // const network = WalletAdapterNetwork.Devnet;
  const network = WalletAdapterNetwork.Mainnet;
  const wallets = useMemo(
    () => [
      new UnsafeBurnerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnection;
