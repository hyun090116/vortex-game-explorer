import { createContext, useContext, useState, ReactNode } from "react";
import type { Game } from "@/data/games";
import { useToast } from "@/hooks/use-toast";

interface CartItem extends Game {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string) => void;
  updateQuantity: (gameId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (game: Game) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === game.id);
      
      if (existingItem) {
        toast({
          title: "이미 장바구니에 있습니다",
          description: `${game.title}은(는) 이미 장바구니에 담겨있습니다.`,
        });
        return prevItems;
      }

      toast({
        title: "장바구니에 추가되었습니다",
        description: `${game.title}이(가) 장바구니에 추가되었습니다.`,
      });

      return [...prevItems, { ...game, quantity: 1 }];
    });
  };

  const removeFromCart = (gameId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== gameId));
    toast({
      title: "장바구니에서 제거되었습니다",
      description: "게임이 장바구니에서 제거되었습니다.",
    });
  };

  const updateQuantity = (gameId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(gameId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === gameId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

