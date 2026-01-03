// src/hooks/useCart.js
import { useState, useEffect, useCallback } from 'react';

export const useCart = (storageKey = 'tasty-cart') => {
  const [cartItems, setCartItems] = useState([]);

  // 从 localStorage 加载持久化数据
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, [storageKey]);

  // 保存到 localStorage
  const saveToStorage = useCallback((items) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [storageKey]);

  // 添加商品到购物车
  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 从购物车移除商品
  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== productId);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 更新商品数量
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage, removeFromCart]);

  // 清空购物车
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  // 计算总价（使用精确计算避免浮点数问题）
  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + Math.round(item.price * 100) * item.quantity;
  }, 0) / 100;

  // 计算总数量
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice: totalPrice.toFixed(2),
    totalItems,
  };
};

export default useCart;
