"use client"
import type { FC } from 'react';
import { Provider } from 'react-redux'
import { store } from './store';

interface StoreProviderProps {
    children: React.ReactNode
}

const StoreProvider: FC<StoreProviderProps> = ({children}) => {
    return (
        <Provider store={store}>
                {children}
        </Provider>
    );
}

export default StoreProvider;
