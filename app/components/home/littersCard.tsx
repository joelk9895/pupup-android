import { Litter } from '@/app/types/home';
import { RootStackParamList } from '@/app/types/navigation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


export default function LittersCardHome(litter: Litter) {
  const navigation = useNavigation<NavProp>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('LitterFullScreen', litter)}>
      <View style={{ alignItems: 'flex-start', marginRight: 15 }}>
        <View style={styles.card}>
          <SharedElement id={`litter.${litter.id}.image`}>
            <Image
              source={{ uri: litter.image_url }}
              style={styles.image}
            />
          </SharedElement>
          <View style={styles.overlay}>
            <Image
              source={require('@/assets/images/pupIcon.png')}
              style={{ width: 12, height: 12, tintColor: 'white', marginRight: 4 }}
            />
            <Text style={styles.overlayText}>New Litter</Text>
          </View>
        </View>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{litter.name}</Text>
        <Text style={styles.subTitle}>Due {new Date(litter.ready_date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    width: 150,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginTop: 8,
    fontSize: 15,
    maxWidth: 150,
    fontFamily: 'Figtree_600SemiBold',
    textAlign: 'left',
    textOverflow: 'ellipsis',
  },
  subTitle: {
    fontSize: 12,
    fontFamily: 'Roboto',
    textAlign: 'left',
    color: '#666',
    marginTop: 2,
  },
  breed: {
    fontSize: 12,
    maxWidth: 150,
    fontFamily: 'Figtree_700Bold',
    textAlign: 'left',
    backgroundColor: 'black',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    elevation: 2, // Android z-index
  },
  overlayText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Figtree_600SemiBold',
  },
});