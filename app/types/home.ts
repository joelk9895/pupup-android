interface Breed {
  id: number;
  name: string;
  img_url: string;
}

interface Litter {
  id: number;
  name: string;
  image_url: string;
  ready_date: string;
  video_id: string;
  created_at: string | null;

  expected_dogs: number;
  puppies: Puppies[];
  slots_filled: number;
}

interface Breeder {
  id: number;
  name: string;
  background_img: string;
  profile_img: string;
  description: string;
  location: string;
  is_featured: boolean;
}

type HomeResponse = {
  breeds: Breed[];
  litters: Litter[];
  breeders: Breeder[];
  featured_litters: FeaturedLitter;
  puppies: Puppies[];
};

type FeaturedLitter = {
  id: number;
  title: string;
  description: string;
  litters: Litter[];
};

type Puppies = {
  id: number,
  name: string;
  gender: string;
  breed: string;
  image_url: string;
  booked: boolean;
}

export { Breed, Breeder, FeaturedLitter, HomeResponse, Litter, Puppies };

