import React from 'react';
import {View,Text,FlatList,Image,StyleSheet,TouchableOpacity,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavouritesContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Favorites'
>;



export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, toggleFavorite } = useFavorites();

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
        activeOpacity={0.8}
      >
        <TouchableOpacity
          style={styles.heartIcon}
          onPress={() => toggleFavorite(item)}
        >
          <Ionicons name="heart" size={26} color="black" />
        </TouchableOpacity>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={40} color="#000" />
            </TouchableOpacity>
            <View>
                <Text style={styles.titleHeader}>My Favorites</Text>
                <Text style={styles.countText}>
                {favorites.length} {favorites.length === 1 ? 'product' : 'products'}
                </Text>
            </View>
            </View>
        <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
            <Text style={styles.emptyText}>No favorite products yet.</Text>
        }
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 4,
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 32,
  },
  countText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    marginTop: -8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
    gap: 8,
  },
  
  backButton: {
    marginRight: 8,
  }
});
