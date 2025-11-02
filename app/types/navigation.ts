import { Litter } from "./home";

export type RootStackParamList = {
  Home: undefined;
  LitterFullScreen: Litter;
  MoreInfo: { itemId: number };
};

