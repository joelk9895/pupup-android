import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface LittersCardHomeProps {
  name: string;
  image: string;
  readyDate: string;
}

export default function LittersCardHome({ name, image, readyDate }: LittersCardHomeProps) {
  return (
    <View style={{ alignItems: 'flex-start', marginRight: 15 }}>
      <View style={styles.card}>
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
        <View style={styles.overlay}>
          <Image
            source={require('../../assets/images/pupIcon.png')}
            style={{ width: 12, height: 12, tintColor: 'white', marginRight: 4 }}
          />
          <Text  style={styles.overlayText}>New Litter</Text>
        </View>
      </View>
      <Text numberOfLines={2}  ellipsizeMode="tail" style={styles.title}>{name}</Text>
      <Text style={styles.subTitle}>Due {new Date(readyDate).toLocaleDateString()}</Text>
      {/* <Text style={styles.breed}>Golden Retriever</Text> Assuming breed is Golden Retriever, or pass from props if available */}
    </View>
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