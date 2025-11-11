import { Breed, Litter } from "./home";

export type RootStackParamList = {
  Home: undefined;
  LitterFullScreen: Litter;
  Breeds: { breed: Breed} | undefined;
  Litter: { 
      litterId: number;
      selectedPuppyId?: number; // Optional parameter for puppy selection
  } | undefined;
  Application: {
      litterId: number;
      puppies: AnimalSummary[];
      litterName: string;
      breed: string;
  } | undefined;
  ApplicationSuccess: {
     puppy: AnimalSummary;
  } | undefined;
  Messages: undefined;
};

type AnimalSummary = {
  id: number;
  name: string;
  gender?: string;
  description?: string;
  image_url?: string;
  booked?: boolean;
  breed?: string;
};
