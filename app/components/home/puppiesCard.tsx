import GenderIcon from "@/app/icons/genderIcon";
import { Puppies } from "@/app/types/home";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function PuppiesCard({ puppies }: { puppies: Puppies }) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: puppies.image_url }} style={styles.image} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 8, paddingVertical: 6 }}>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{puppies.name}</Text>
                    <Text style={styles.breed}>{puppies.breed}</Text>
                </View>
                <GenderIcon gender={puppies.gender} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        overflow: "hidden",
        width: 150,
        height: 155,
        marginBottom: 16,
    },
    image: {
        width: "100%",
        height: 111,
    },
    name: {
        fontSize: 14,
        fontFamily: "Figtree_600SemiBold",
    },
    breed: {
        fontSize: 9,
        fontFamily: "Roboto",
        fontWeight: "500",
        color: "#666",
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        justifyContent: "space-between",
    },


});