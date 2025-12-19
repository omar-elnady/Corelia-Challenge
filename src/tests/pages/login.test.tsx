import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/pages/login';
import { renderWithProviders } from '@/tests/utils/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const testUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
};

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const preloadedState = {
        auth: {
            users: [testUser],
            currentUser: null,
            isAuthenticated: false,
            rememberedEmail: null,
        }
    };

    it('renders login form correctly', () => {
        renderWithProviders(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
        renderWithProviders(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );
        const user = userEvent.setup();

        await user.click(screen.getByRole('button', { name: /Log in/i }));

        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
    });

    it('handles successful login', async () => {
        renderWithProviders(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>,
            { preloadedState }
        );
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText(/Email Address/i), testUser.email);
        await user.type(screen.getByPlaceholderText(/Password/i), testUser.password);

        await user.click(screen.getByRole('button', { name: /Log in/i }));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Welcome back'));
        }, { timeout: 2000 });

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('handles invalid credentials (wrong password)', async () => {
        renderWithProviders(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>,
            { preloadedState }
        );
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText(/Email Address/i), testUser.email);
        await user.type(screen.getByPlaceholderText(/Password/i), 'WrongPass');

        await user.click(screen.getByRole('button', { name: /Log in/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Wrong password');
        }, { timeout: 2000 });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles user not found', async () => {
        renderWithProviders(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>,
            { preloadedState }
        );
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText(/Email Address/i), 'nonexistent@example.com');
        await user.type(screen.getByPlaceholderText(/Password/i), 'Password123!');

        await user.click(screen.getByRole('button', { name: /Log in/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('User not found');
        }, { timeout: 2000 });
    });

    it('pre-fills email if remembered', () => {
        const stateWithRemember = {
            auth: {
                ...preloadedState.auth,
                rememberedEmail: 'remembered@example.com'
            }
        };

        renderWithProviders(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>,
            { preloadedState: stateWithRemember }
        );

        expect(screen.getByPlaceholderText(/Email Address/i)).toHaveValue('remembered@example.com');
        expect(screen.getByRole('checkbox', { name: /Remember me/i })).toBeChecked();
    });
});
