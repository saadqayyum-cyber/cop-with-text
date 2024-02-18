import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CARD_DESCRIPTIONS, CARD_TITLES, MINT_BUTTON_TITLES, MINT_GROUPS, MintGroup } from "./constants";
import { Audio } from "react-loader-spinner";
import banner from "../assets/banner.png";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  CandyGuard,
  CandyMachine,
  DefaultGuardSetMintArgs,
  NftGate,
  SolPayment,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { Option, Umi, generateSigner, transactionBuilder, unwrapSome } from "@metaplex-foundation/umi";
import { publicKey, some, unwrapOption } from "@metaplex-foundation/umi";
import { fetchCandyMachine, fetchCandyGuard } from "@metaplex-foundation/mpl-candy-machine";
import { fromTxError } from "@/utils/errors";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mintV2 } from "@metaplex-foundation/mpl-candy-machine";
import { Metaplex, Nft, PublicKey } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import toast from "react-hot-toast";
import * as bs58 from "bs58";
import Swal from "sweetalert2";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

// UMI Setup
let umi: Umi;
let metaplex: Metaplex;
let dasUmi: Umi;

const RPC_ENDPOINT_URL = process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL;
const HELIUS_RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL;

if (RPC_ENDPOINT_URL) {
  // Init UMI
  umi = createUmi(RPC_ENDPOINT_URL).use(mplCandyMachine());
  // Init Metaplex
  const connection = new Connection(RPC_ENDPOINT_URL);
  metaplex = new Metaplex(connection);
} else {
  throw new Error("RPC_ENDPOINT is not defined. Please provide NEXT_PUBLIC_RPC_ENDPOINT_URL env variable.");
}

if (HELIUS_RPC_URL) {
  // DAS UMI
  dasUmi = createUmi(HELIUS_RPC_URL).use(dasApi());
} else {
  throw new Error("HELIUS_RPC_URL is not defined. Please provide NEXT_PUBLIC_HELIUS_RPC_URL env variable.");
}

function Mint() {
  const wallet = useWallet();

  const [candyMachine, setCandyMachine] = useState<CandyMachine | null>(null);
  const [candyGuard, setCandyGuard] = useState<CandyGuard | null>(null);

  const [selectedGroup, setSelectedGroup] = useState<MintGroup>(MINT_GROUPS.PUBLIC);
  const [isLoading, setIsLoading] = useState(false);
  const [nftsMinted, setNFTsMinted] = useState(0);
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [candyMachineFetchTrigger, setCandyMachineFetchTrigger] = useState(false);

  const handleGroupChange = (_selectedMintGroup: MintGroup) => {
    setSelectedGroup(_selectedMintGroup);
  };

  // Set Candy Machine and Candy Guard On Mount
  const CANDY_MACHINE_ID = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID;

  const fetchCandyMachineData = async () => {
    if (!CANDY_MACHINE_ID) throw new Error("Please, provide a NEXT_PUBLIC_CANDY_MACHINE_ID env variable");
    const candyMachinePublicKey = publicKey(CANDY_MACHINE_ID);
    const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey);
    const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);

    setCandyMachine(candyMachine);
    setCandyGuard(candyGuard);
    setTotalNFTs(candyMachine.itemsLoaded);
    setNFTsMinted(+candyMachine.itemsRedeemed.toString());
  };

  useEffect(() => {
    fetchCandyMachineData();
  }, [candyMachineFetchTrigger]);

  // Mint
  const handleMint = async () => {
    if (!candyMachine) throw new Error("No candy machine");
    if (!candyGuard) throw new Error("No candy guard found. Set up a guard for your candy machine.");

    setIsLoading(true);

    const { groups } = candyGuard;
    const umiWalletAdapter = umi.use(walletAdapterIdentity(wallet));
    const nftMint = generateSigner(umiWalletAdapter);
    let group: Option<string>;
    let mintArgs: Partial<DefaultGuardSetMintArgs> = {};

    // 1. Public
    if (selectedGroup === MINT_GROUPS.PUBLIC) {
      group = some(MINT_GROUPS.PUBLIC);

      const guards = groups.find((group) => group.label === MINT_GROUPS.PUBLIC)?.guards;
      const solPaymentGuard: Option<SolPayment> | undefined = guards?.solPayment;

      if (solPaymentGuard) {
        const solPayment: SolPayment | null = unwrapOption(solPaymentGuard);

        if (solPayment) {
          const treasury = solPayment.destination;

          mintArgs.solPayment = some({
            destination: treasury,
          });
        }
      }
    }
    // 2. SG
    else if (selectedGroup === MINT_GROUPS.GENESIS) {
      group = some(MINT_GROUPS.GENESIS);

      const guards = groups.find((group) => group.label === MINT_GROUPS.GENESIS)?.guards;
      const nftGateGuard: Option<NftGate> | undefined = guards?.nftGate;

      if (nftGateGuard === undefined) {
        toast.error("NFT Gate guard not available");
        return;
      }

      const nftGate: NftGate | null = unwrapOption(nftGateGuard);

      if (nftGate) {
        const collectionMint = new PublicKey(nftGate.requiredCollection);
        console.log({ collectionMint });

        if (!wallet.publicKey) {
          toast.error("User Wallet address not found.");
          return;
        }

        const userNFTs = await metaplex.nfts().findAllByOwner({
          owner: wallet.publicKey,
        });

        const filteredNfts = userNFTs.filter((nft) => nft.collection && nft.collection.address.equals(collectionMint));

        if (filteredNfts.length === 0) {
          toast.error("You do not own any NFT from Saga Genesis Collection.");
          setIsLoading(false);
          return;
        }

        interface ExtendedNFT extends Nft {
          mintAddress: {
            readonly toBase58: () => string;
          };
        }

        const nftMint = filteredNfts[0] as ExtendedNFT;
        const nftMintStringAddress = nftMint.mintAddress.toBase58();
        const nftMintUmiPublicKey = publicKey(nftMintStringAddress);

        mintArgs.nftGate = some({
          mint: nftMintUmiPublicKey,
        });

        mintArgs.mintLimit = {
          id: 1,
        };
      }
    }

    // 3. SM
    else if (selectedGroup === MINT_GROUPS.MONKE) {
      group = some(MINT_GROUPS.MONKE);

      const walletAddress = wallet?.publicKey?.toBase58();
      if (walletAddress === undefined) {
        toast.error("Please connect Wallet.");
        return;
      }

      const rpcAssetList = await dasUmi.rpc.getAssetsByOwner({
        owner: publicKey(walletAddress),
      });

      const cnft = rpcAssetList.items.find(
        (item) =>
          item.grouping[0]?.group_key == "collection" &&
          item.grouping?.[0]?.group_value == "GokAiStXz2Kqbxwz2oqzfEXuUhE7aXySmBGEP7uejKXF"
      );

      if (!cnft) {
        toast.error("You do not own any NFT from Saga Monke Collection.");
        setIsLoading(false);
        return;
      }

      mintArgs.mintLimit = {
        id: 2,
      };
    }
    // 4. NO GROUP
    else {
      toast.error("Mint group is not provided");
      return;
    }

    try {
      const transaction = transactionBuilder()
        .add(setComputeUnitLimit(umiWalletAdapter, { units: 800_000 }))
        .add(
          mintV2(umiWalletAdapter, {
            candyMachine: candyMachine.publicKey,
            nftMint,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            tokenStandard: candyMachine.tokenStandard,
            candyGuard: candyGuard?.publicKey,
            group,
            mintArgs,
          })
        );

      const { signature } = await transaction.sendAndConfirm(umi, {
        confirm: { commitment: "confirmed" },
      });

      if (!signature) return;

      const txid = bs58.encode(signature);
      console.log("success", `Mint successful! ${txid}`);

      Swal.fire({
        title: "Mint Successful",
        icon: "success",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <p style="margin-bottom: 10px;">Your mint was successful!</p>
            <p style="margin-bottom: 10px;">You can view the transaction on Solscan:</p>
            <p style="margin-bottom: 0;"><a href="https://solscan.io/tx/${txid}" target="_blank" style="text-decoration: none; color: #007bff;">View Transaction</a></p>
          </div>
        `,
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: `Close`,
        confirmButtonAriaLabel: "Close",
        customClass: {
          title: "swal-title",
          htmlContainer: "swal-html-container",
          closeButton: "swal-close-button",
          confirmButton: "swal-confirm-button",
        },
      });

      // setTimeout(() => {
      //   setCandyMachineFetchTrigger((prevState) => !prevState);
      // }, 8000);
    } catch (e: any) {
      if (e.toString().includes("Error Code: CandyMachineEmpty")) {
        toast.error("All NFTs have been minted!");
        return;
      }

      const msg = fromTxError(e);
      console.log(e, msg);

      if (msg) {
        toast.error(msg.message);
      } else {
        const msg = e.message || e.toString();
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      {/* Card */}
      <div className="w-80 sm:w-[24em] border shadow-sm rounded-xl bg-black dark:border-gray-700 dark:shadow-slate-700/[.7]">
        {/* Nav Tabs */}
        <nav
          className="relative z-0 flex border-b rounded-xl divide-x divide-gray-200 dark:border-gray-700 dark:divide-gray-700"
          aria-label="Tabs"
        >
          <div
            className={`group relative min-w-0 flex-1 py-4 px-4 border-b-2 cursor-pointer ${
              selectedGroup === MINT_GROUPS.PUBLIC
                ? "selected-group text-white"
                : "not-selected-group text-gray-500 hover:text-gray-700"
            } rounded-ss-xl text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:text-gray-300`}
            onClick={() => handleGroupChange(MINT_GROUPS.PUBLIC)}
          >
            Public Mint
          </div>

          <div
            className={`group relative min-w-0 flex-1 py-4 px-4 border-b-2 cursor-pointer ${
              selectedGroup === MINT_GROUPS.GENESIS
                ? "selected-group text-white"
                : "not-selected-group text-gray-500 hover:text-gray-700"
            } text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:text-gray-300`}
            onClick={() => handleGroupChange(MINT_GROUPS.GENESIS)}
          >
            Saga Genesis Free Mint
          </div>

          <div
            className={`group relative min-w-0 flex-1 py-4 px-4 cursor-pointer border-b-2 ${
              selectedGroup === MINT_GROUPS.MONKE
                ? "selected-group text-white"
                : "not-selected-group text-gray-500 hover:text-gray-700"
            } rounded-se-xl text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:text-gray-300`}
            onClick={() => handleGroupChange(MINT_GROUPS.MONKE)}
          >
            Saga Monkes Free Mint
          </div>
        </nav>

        <div className="p-4 text-center md:py-7 md:px-5">
          <h3 className="text-lg font-bold text-white">{CARD_TITLES[selectedGroup]}</h3>
          <p className="mt-2 text-white text-[17px]">{CARD_DESCRIPTIONS[selectedGroup]}</p>
        </div>

        {/* Card Image */}
        <div className="flex justify-center items-center">
          <Image className="w-64 h-auto rounded-xl" src={banner} alt="banner" />
        </div>

        {/* Minting Section */}
        <div className="p-2 text-center md:py-7 md:px-5">
          <div className="mb-3">
            Minted {nftsMinted} / {totalNFTs}
          </div>

          {isLoading ? (
            <div className="inline-flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-orange-800 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              <Audio height="60" width="60" color="green" ariaLabel="loading" />
            </div>
          ) : (
            <div className="cursor-pointer inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-orange-800 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              {wallet?.publicKey ? (
                <div className="py-4 px-12" onClick={handleMint}>
                  {MINT_BUTTON_TITLES[selectedGroup]}
                </div>
              ) : (
                <div className="connect-wallet-mint">
                  <WalletMultiButton />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mint;
