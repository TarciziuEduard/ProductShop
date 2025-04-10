import React, { useEffect, useState } from 'react';
import {View,Text,StyleSheet,ActivityIndicator,Image,TouchableOpacity,ScrollView,useWindowDimensions,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Svg, Circle } from 'react-native-svg';
import type { RootStackParamList } from '../App';
import { useFavorites } from '../context/FavouritesContext';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

type Rating = {
  rate: number;
  count: number;
};

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: Rating;
};

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { favorites, toggleFavorite } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [textLines, setTextLines] = useState(0);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#666" />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }
  const isFavorite = favorites.some((fav) => fav.id === product.id);

  return (
    <View style={{ flex: 1 }}>
      {/* StatusBar translucent */}
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeAreaContent}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Secțiunea de sus: wave, iconițe */}
          <View style={styles.topContainer}>
            <View style={styles.waveContainer}>
              <Svg
                width="100%"
                height="240"
                viewBox={`0 0 ${width} ${height / 3}`}
                style={StyleSheet.absoluteFill}
              >
                <Circle cx={width / 2} cy={-height / 3} r={580} fill="#000" />
              </Svg>
            </View>
            <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={40} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favIcon}
              onPress={() => product && toggleFavorite(product)}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={40}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.imageWrapper}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
          </View>

          {/* Secțiunea de detalii */}
          <View style={styles.detailsContainer}>
            <View style={styles.titlePriceContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />
            <View style={{ marginBottom: 8 }}>
                <Text
                    style={styles.description}
                    numberOfLines={!isExpanded && showReadMore ? 3 : undefined}
                    onTextLayout={(e) => {
                        const lines = e.nativeEvent.lines.length;
                        if (lines > 3 && !showReadMore) {
                        setShowReadMore(true);
                        setTextLines(lines);
                        }
                    }}
                    >
                    {product.description}
                </Text>

                {/* Butonul Read more / Read less */}
                {showReadMore && textLines > 3 && (
                    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                        <Text style={styles.readMoreText}>
                        {isExpanded ? 'Read less' : 'Read more'}
                        </Text>
                    </TouchableOpacity>
                    )}
                </View>
                
            <View style={[styles.divider, { marginTop: 16 }]} />
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>Rating</Text>
              <Text style={styles.ratingValue}>
                {product.rating.rate} from {product.rating.count} Reviews
              </Text>
            </View>
          </View>
        </ScrollView>
        {/* Butonul ADD TO CART*/}
        <TouchableOpacity style={styles.addToCartButton}>
              <Text style={styles.addToCartText}>ADD TO CART</Text>
            </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  
  topContainer: {
    position: 'relative',
    height: 220,
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 240,
    overflow: 'hidden',
  },
  backIcon: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 2,
  },
  favIcon: {
    position: 'absolute',
    top: 55,
    right: 20,
    zIndex: 2,
  },
  
  imageWrapper: {
    alignItems: 'center',
    marginTop: -40,
  },
  productImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
  
  detailsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 20, 
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  titlePriceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    marginRight: 8, 
  },
  price: {
    fontSize: 20,
    fontWeight: '500', 
    fontFamily: 'Bilo',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: 'black',
    fontWeight:'condensedBold',
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 17,
    color: 'black',
  },
  ratingValue: {
    fontSize: 17,
    color: '#FF9900',
  },
  addToCartButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 24, 
    paddingVertical: 12,   
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,  
    height: 50,
    },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  readMoreText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});
