import React, { useState } from 'react';
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TimelineItem = {
    title: string;
    description: string;
    date: string;
    image_urls?: string[];
};

type Props = {
    timeline: TimelineItem[] | [];
};

const { width: screenWidth } = Dimensions.get('window');

export default function Timeline({ timeline }: Props) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [allImages, setAllImages] = useState<string[]>([]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 30) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months !== 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} year${years !== 1 ? 's' : ''} ago`;
        }
    };

    const openImageViewer = (imageUrl: string, images: string[]) => {
        const imageIndex = images.findIndex(img => img === imageUrl);
        setSelectedImage(imageUrl);
        setSelectedImageIndex(imageIndex);
        setAllImages(images);
    };

    const closeImageViewer = () => {
        setSelectedImage(null);
        setSelectedImageIndex(0);
        setAllImages([]);
    };

    const navigateToImage = (direction: 'next' | 'prev') => {
        const currentIndex = selectedImageIndex;
        let newIndex;

        if (direction === 'next') {
            newIndex = currentIndex + 1 >= allImages.length ? 0 : currentIndex + 1;
        } else {
            newIndex = currentIndex - 1 < 0 ? allImages.length - 1 : currentIndex - 1;
        }

        setSelectedImageIndex(newIndex);
        setSelectedImage(allImages[newIndex]);
    };

    const renderImageGrid = (images: string[]) => {
        const imageCount = images.length;
        let columns = 1;
        if (imageCount === 2) columns = 2;
        else if (imageCount >= 3) columns = 3;

        const cardPadding = 32;
        const imageGap = 2;
        const totalGaps = (columns - 1) * imageGap;
        const imageWidth = (screenWidth - cardPadding - totalGaps) / columns;
        const rows = Math.ceil(imageCount / columns);

        return (
            <View style={styles.imageGrid}>
                {Array.from({ length: rows }, (_, rowIndex) => (
                    <View key={rowIndex} style={styles.imageRow}>
                        {images
                            .slice(rowIndex * columns, (rowIndex + 1) * columns)
                            .map((imageUrl, imageIndex) => (
                                <TouchableOpacity
                                    key={imageIndex}
                                    onPress={() => openImageViewer(imageUrl, images)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={{ uri: imageUrl }}
                                        style={[
                                            styles.gridImage,
                                            { width: imageWidth, height: imageWidth }
                                        ]}
                                    />
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.comingSoonText}>Today</Text>
            </View>
            <View style={styles.timelineContainer}>
                <View style={styles.verticalLineAbsolute} pointerEvents="none" />
                {timeline.slice().reverse().map((item, index) => (
                    <View key={index} style={styles.timelineRow}>
                        <View style={styles.contentCard}>
                            {item.image_urls && item.image_urls.length > 0 && renderImageGrid(item.image_urls)}
                            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                            <Text style={styles.titleText}>{item.title}</Text>
                            <Text style={styles.descriptionText}>{item.description}</Text>
                        </View>
                    </View>
                ))}
            </View>
            <View style={styles.timelineEnd}>
                <View style={styles.endPoint} />
                <Text style={styles.endText}>ONE YEAR AGO</Text>
            </View>

            <Modal 
                visible={selectedImage !== null && allImages.length > 0} 
                transparent={true} 
                animationType="fade"
                onRequestClose={closeImageViewer}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalCloseArea}
                        onPress={closeImageViewer}
                        activeOpacity={1}
                    />

                    {allImages.length > 0 && (
                        <View style={styles.imageViewerContainer}>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={(event) => {
                                    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                                    if (newIndex !== selectedImageIndex && newIndex < allImages.length) {
                                        setSelectedImageIndex(newIndex);
                                        setSelectedImage(allImages[newIndex]);
                                    }
                                }}
                                contentOffset={{ x: selectedImageIndex * screenWidth, y: 0 }}
                            >
                                {allImages.map((imageUrl, index) => (
                                    <View key={index} style={styles.imageSlide}>
                                        <Image
                                            source={{ uri: imageUrl }}
                                            style={styles.fullscreenImage}
                                            resizeMode="contain"
                                        />
                                    </View>
                                ))}
                            </ScrollView>

                            <View style={styles.imageCounter}>
                                <Text style={styles.counterText}>
                                    {selectedImageIndex + 1} / {allImages.length}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeImageViewer}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const CENTER_PERCENT = '50%';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    comingSoonText: {
        fontSize: 13,
        fontFamily: 'Figtree_700Bold',
        color: '#9AA8BA',
        letterSpacing: 1.64,
        textTransform: 'uppercase',
        marginHorizontal: 10,
    },
    timelineContainer: {
        position: 'relative',
        minHeight: 100,
    },
    verticalLineAbsolute: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: CENTER_PERCENT,
        width: 2,
        backgroundColor: '#E2E8F0',
        zIndex: 0,
        transform: [{ translateX: -1 }],
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 60,
        marginBottom: 30,
        position: 'relative',
    },
    contentCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginLeft: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    dateText: {
        fontSize: 14,
        color: '#A8B2C8',
        fontFamily: 'Figtree_500Medium',
        marginTop: 16,
        marginHorizontal: 16,
    },
    titleText: {
        fontSize: 20,
        fontFamily: 'Figtree_700Bold',
        color: '#1A202C',
        lineHeight: 28,
        marginTop: 4,
        marginHorizontal: 16,
    },
    descriptionText: {
        fontSize: 15,
        color: '#4A5568',
        lineHeight: 22,
        marginTop: 8,
        marginHorizontal: 16,
        marginBottom: 16,
        fontFamily: 'Roboto',
    },
    imageGrid: {
        padding: 0,
    },
    imageRow: {
        flexDirection: 'row',
        gap: 2,
        marginBottom: 2,
        paddingHorizontal: 0,
    },
    gridImage: {
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
    },
    timelineEnd: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    endPoint: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E2E8F0',
        borderWidth: 3,
        borderColor: '#FFF',
        marginBottom: 16,
    },
    endText: {
        fontSize: 14,
        fontFamily: 'Figtree_700Bold',
        color: '#A8B2C8',
        letterSpacing: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    imageViewerContainer: {
        flex: 1,
        width: '100%',
        position: 'relative',
    },
    imageSlide: {
        width: screenWidth,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: '90%',
        height: '80%',
        borderRadius: 12,
    },
    imageCounter: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    counterText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Figtree_600SemiBold',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 20,
        fontFamily: 'Figtree_600SemiBold',
    },
});
