import React, { useEffect, useState } from 'react';
import {View,Text,TextInput,FlatList,StyleSheet,TouchableOpacity,Image,ActivityIndicator,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useFavorites } from '../context/FavouritesContext';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products: ', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredProducts(products);
      return;
    }
    const query = text.toLowerCase();
    const filtered = products.filter((product) =>
      product.title.toLowerCase().startsWith(query)
    );
    setFilteredProducts(filtered);
  };


  const renderItem = ({ item }: { item: Product }) => {
    const isFavorite = favorites.some((fav) => fav.id === item.id);
    const shortDescription =
      item.description.length > 40
        ? item.description.slice(0, 40) + '...'
        : item.description;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
      >
        <TouchableOpacity
          style={styles.heartIconContainer}
          onPress={() => toggleFavorite(item)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={25}
            color="black"
            style={{ transform: [{ scaleY: 0.9 }] }}
          />
        </TouchableOpacity>
        
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.shortDesc} numberOfLines={2}>
            {shortDescription}
          </Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#666" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Search Bar*/}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={24}
              color="#8B8B8B"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search product"
              placeholderTextColor="#8B8B8B"
              style={[styles.searchInput, { fontFamily: 'Bilo' }]}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        {/*Titlu, număr de produse și iconul pentru Favorites*/}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerTitle}>Products</Text>
            <Text style={styles.productCount}>
              {filteredProducts.length} products found
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Favorites')}
            style={styles.headerFavoriteIcon}
          >
            <Ionicons name="heart-outline" size={42} color="black" />
          </TouchableOpacity>
        </View>

        {/* Lista de produse */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingVertical: 8,
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems:'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 7,
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
  productCount: {
    fontSize: 16,
    fontFamily: 'Bilo',
    marginTop: 4,
  },
  headerFavoriteIcon: {
    padding: 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 8,
    marginVertical: 8,
    padding: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginVertical: 8,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 7,
    color: '#000000',
  },
  shortDesc: {
    fontSize: 13,
    color: '#7C7A7A',
    marginBottom: 7,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 7,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
