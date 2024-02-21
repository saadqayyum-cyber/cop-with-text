export const MINT_GROUPS = {
  PUBLIC: "Public",
  GENESIS: "SG",
  MONKE: "SM",
  SWAG: "LSW",
} as const;

export type MintGroup = (typeof MINT_GROUPS)[keyof typeof MINT_GROUPS];

export const CARD_TITLES: {
  Public: string;
  SG: string;
  SM: string;
  LSW: string;
} = {
  Public: "COP WITH TEXT",
  SG: "Saga Genesis Free Mint",
  SM: "Saga Monke Free Mint",
  LSW: "Little Swag World",
};

export const CARD_DESCRIPTIONS = {
  Public: "",
  SG: "We bought the phones. We got some stuff. Now here is something else.",
  SM: "Strictly for my monkes. Whether you have a Solana Fur or a slick floor model you deserve a free mint.",
  LSW: "Free mint for my swaggy sun lovers",
};

export const MINT_BUTTON_TITLES = {
  Public: "MINT 0.05 SOL",
  SG: "FREE MINT",
  SM: "FREE MINT",
  LSW: "FREE MINT",
};
