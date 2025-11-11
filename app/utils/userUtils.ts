import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getCurrentUserId(): Promise<number | null> {
  try {
    const userDataString = await AsyncStorage.getItem('user_data');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return userData.id || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}