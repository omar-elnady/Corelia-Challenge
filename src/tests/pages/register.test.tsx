import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '@/pages/register';
import { renderWithProviders } from '@/tests/utils/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('RegisterPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const preloadedState = {
        auth: {
            users: [],
            currentUser: null,
            isAuthenticated: false,
            rememberedEmail: null,
        }
    };

    it('renders register form correctly', () => {
        renderWithProviders(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    });

    it('shows validation errors for invalid inputs', async () => {
        renderWithProviders(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );
        const user = userEvent.setup();

        await user.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(screen.getByText('Full Name is required')).toBeInTheDocument();
            expect(screen.getByText('Email is required')).toBeInTheDocument();
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
    });

    it('validates password complexity', async () => {
        renderWithProviders(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText(/Password/i), 'weak');
        await user.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(screen.getByText(/Password must contain/i)).toBeInTheDocument();
        });
    });

    it('handles successful registration', async () => {
        jest.useFakeTimers();

        renderWithProviders(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>,
            { preloadedState }
        );
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        await user.type(screen.getByPlaceholderText(/Full Name/i), 'New User');
        await user.type(screen.getByPlaceholderText(/Email Address/i), 'newuser@example.com');
        await user.type(screen.getByPlaceholderText(/Password/i), 'StrongPass1!');

        await user.click(screen.getByRole('button', { name: /Register/i }));

        await React.act(async () => {
            jest.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Registration successful'));
        });

        await React.act(async () => {
            jest.advanceTimersByTime(2000);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/login');

        jest.useRealTimers();
    });

    it('prevents duplicate email registration', async () => {
        const existingUser = {
            id: '1',
            name: 'Existing',
            email: 'existing@example.com',
            password: 'Pass',
        };

        renderWithProviders(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>,
            {
                preloadedState: {
                    auth: { ...preloadedState.auth, users: [existingUser] }
                }
            }
        );
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText(/Full Name/i), 'Test');
        await user.type(screen.getByPlaceholderText(/Email Address/i), 'existing@example.com');
        await user.type(screen.getByPlaceholderText(/Password/i), 'StrongPass1!');

        await user.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Email is already registered');
        }, { timeout: 2000 });

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
