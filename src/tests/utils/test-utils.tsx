import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/authSlice';
import contactsReducer from '@/redux/contactsSlice';
import type { RootState } from '@/redux/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>;
    store?: ReturnType<typeof createTestStore>;
}

function createTestStore(preloadedState?: Partial<RootState>) {
    return configureStore({
        reducer: {
            auth: authReducer,
            contacts: contactsReducer,
        },
        preloadedState: preloadedState as RootState,
    });
}

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState = {},
        store = createTestStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return <Provider store={store}>{children}</Provider>;
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
