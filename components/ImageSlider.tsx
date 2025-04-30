// components/ImageSlider.tsx
import React from "react";
import { View, Image, FlatList, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = (width * 9) / 16;

interface Props {
  images: string[];
}

const ImageSlider: React.FC<Props> = ({ images }) => {
  return (
    <FlatList
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      data={images}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
      )}
    />
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  image: {
    width,
    height: IMAGE_HEIGHT,
  },
});
