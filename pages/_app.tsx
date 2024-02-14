import Header from "@/components/Header";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
// import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";

const WalletConnection = dynamic(() => import("@/components/WalletConnection"), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletConnection>
      <Toaster position="top-center" />
      <main>
        <Layout>
          <Header />
          <Component {...pageProps} />
        </Layout>
      </main>
    </WalletConnection>
  );
}
