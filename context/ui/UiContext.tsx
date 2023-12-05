
import { createContext } from 'react';

interface ContextProps {
    // Properties
    isMenuOpen: boolean;

    // Methods
    toggleSideMenu: () => void;
}

export const UiContext = createContext({} as ContextProps);
