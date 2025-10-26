import { Figtree_300Light } from '@expo-google-fonts/figtree/300Light';
import { Figtree_300Light_Italic } from '@expo-google-fonts/figtree/300Light_Italic';
import { Figtree_400Regular } from '@expo-google-fonts/figtree/400Regular';
import { Figtree_400Regular_Italic } from '@expo-google-fonts/figtree/400Regular_Italic';
import { Figtree_500Medium } from '@expo-google-fonts/figtree/500Medium';
import { Figtree_500Medium_Italic } from '@expo-google-fonts/figtree/500Medium_Italic';
import { Figtree_600SemiBold } from '@expo-google-fonts/figtree/600SemiBold';
import { Figtree_600SemiBold_Italic } from '@expo-google-fonts/figtree/600SemiBold_Italic';
import { Figtree_700Bold } from '@expo-google-fonts/figtree/700Bold';
import { Figtree_700Bold_Italic } from '@expo-google-fonts/figtree/700Bold_Italic';
import { Figtree_800ExtraBold } from '@expo-google-fonts/figtree/800ExtraBold';
import { Figtree_800ExtraBold_Italic } from '@expo-google-fonts/figtree/800ExtraBold_Italic';
import { Figtree_900Black } from '@expo-google-fonts/figtree/900Black';
import { Figtree_900Black_Italic } from '@expo-google-fonts/figtree/900Black_Italic';
import { useFonts } from '@expo-google-fonts/figtree/useFonts';


export default function useFigtreeFonts() {
  const [fontsLoaded, error] = useFonts({
    Figtree_300Light,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
    Figtree_800ExtraBold,
    Figtree_900Black,
    Figtree_300Light_Italic,
    Figtree_400Regular_Italic,
    Figtree_500Medium_Italic,
    Figtree_600SemiBold_Italic,
    Figtree_700Bold_Italic,
    Figtree_800ExtraBold_Italic,
    Figtree_900Black_Italic,
    'Recoleta': require('../../assets/fonts/Recoleta-Regular.ttf'),

  });

  return { fontsLoaded, error };
}
