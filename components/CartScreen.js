// CartScreen.js

import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from './redux/actions';

const CartScreen = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCart(productId));
    };
    const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Cart</Text>
            </View>
            {cart.length === 0 ? (
                <Text style={styles.emptyText}>Your cart is empty</Text>
            ) : (
                <View>
                    <FlatList
                        data={cart}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>${item.price}</Text>
                                <Button
                                    title="Remove"
                                    onPress={() => handleRemoveFromCart(item.id)}
                                />
                            </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        padding:55
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemName: {
        fontSize: 16,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
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
    totalPrice: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },

});

export default CartScreen;
