import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { FavoritesProvider } from './context/FavouritesContext';

export type RootStackParamList = {
  Home: undefined;           
  ProductDetail: { id: number }; 
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home" 
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
