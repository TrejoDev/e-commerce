import { ICartProduct, ShippingAddress } from '@/interfaces';
import { createContext } from 'react';

interface ContextProps {
    // Properties
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress;
         // Methods
    addProductToCart: (product: ICartProduct) => void;
    updatedCartQuantity: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updateAddress: (address: ShippingAddress) => void

    createOrder: () => Promise<{hasError: boolean; message: string}>;
}



export const CartContext = createContext({} as ContextProps);