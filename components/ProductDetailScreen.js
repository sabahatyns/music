// ProductDetailScreen.js

import React, {useState} from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart ,removeFromCart} from './redux/actions';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProductDetailScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
  
    const [addedToCart, setAddedToCart] = useState({});
  
    const dummyProducts = [
      {
        id: 1,
        name: 'Product A',
        price: 19.99,
      },
      {
        id: 2,
        name: 'Product B',
        price: 24.99,
      },
      {
        id: 3,
        name: 'Product C',
        price: 14.99,
      },
    ];
  
    const handleCartAction = (product) => {
      if (addedToCart[product.id]) {
        dispatch(removeFromCart(product.id));
        setAddedToCart((prevState) => ({
          ...prevState,
          [product.id]: false,
        }));
      } else {
        dispatch(addToCart(product));
        setAddedToCart((prevState) => ({
          ...prevState,
          [product.id]: true,
        }));
      }
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Product Detail</Text>
          <View style={styles.cartIconContainer}>
            <Icon
              name="shopping-cart"
              onPress={() => navigation.navigate('Cart')}
              style={styles.cartIcon}
            />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            )}
          </View>
        </View>
        <FlatList
          data={dummyProducts}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <Button
                title={addedToCart[item.id] ? 'Remove from Cart' : 'Add to Cart'}
                onPress={() => handleCartAction(item)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productList}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    cartIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cartIcon: {
      fontSize: 24,
      color: '#000',
    },
    cartBadge: {
      backgroundColor: 'red',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      width: 20,
      height: 20,
      marginLeft: 5,
    },
    cartBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    productList: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    productContainer: {
      backgroundColor: '#fff',
      padding: 20,
      marginBottom: 20,
      borderRadius: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    productPrice: {
      fontSize: 16,
      marginBottom: 10,
    },
  });
  
  export default ProductDetailScreen;
  