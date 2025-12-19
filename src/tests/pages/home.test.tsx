import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/pages/home';
import { renderWithProviders } from '@/tests/utils/test-utils';
import { type Contact } from '@/redux/contactsSlice';

jest.mock('@/components/navbar', () => ({
    Navbar: () => <div data-testid="navbar">Navbar</div>,
}));

jest.mock('@/components/Header', () => {
    return function Header({ title }: { title: string }) {
        return <div data-testid="header">{title}</div>;
    };
});

const currentUser = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
};

const otherUser = {
    id: 'user2',
    name: 'Other User',
    email: 'other@example.com',
    password: 'password',
};

const initialContacts: Contact[] = [
    { id: '1', userId: 'test@example.com', name: 'Alice', phoneNumber: '01012345678', order: 1 },
    { id: '2', userId: 'test@example.com', name: 'Bob', phoneNumber: '01112345678', order: 2 },
    { id: '3', userId: 'other@example.com', name: 'Charlie', phoneNumber: '01212345678', order: 1 },
];

describe('HomePage', () => {
    const preloadedState = {
        auth: {
            currentUser,
            isAuthenticated: true,
            users: [currentUser, otherUser],
            rememberedEmail: null,
        },
        contacts: {
            contacts: initialContacts,
        },
    };

    it('renders correctly with contacts', () => {
        renderWithProviders(<HomePage />, { preloadedState });

        expect(screen.getByText(/You have/)).toBeInTheDocument();
        const twos = screen.getAllByText('2');
        expect(twos.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
    });

    it('renders correctly with no contacts', () => {
        renderWithProviders(<HomePage />, {
            preloadedState: {
                ...preloadedState,
                contacts: { contacts: [] },
            },
        });

        expect(screen.getByText(/You have/)).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('No contacts found')).toBeInTheDocument();
    });

    it('opens add contact modal and adds a new contact', async () => {
        const { store } = renderWithProviders(<HomePage />, { preloadedState });
        const user = userEvent.setup();

        await user.click(screen.getByRole('button', { name: /Add Contact/i }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Add New Contact')).toBeInTheDocument();

        await user.type(screen.getByLabelText(/Name/i), 'David');
        await user.type(screen.getByLabelText(/Phone Number/i), '01099999999');

        await user.click(screen.getByRole('button', { name: /Add Contact/i }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        expect(screen.getByText('David')).toBeInTheDocument();
        expect(screen.getByText('01099999999')).toBeInTheDocument();

        const state = store.getState();
        const newContact = state.contacts.contacts.find(c => c.name === 'David');
        expect(newContact).toBeDefined();
        expect(newContact?.userId).toBe(currentUser.email);
    });

    it('edits an existing contact', async () => {
        renderWithProviders(<HomePage />, { preloadedState });
        const user = userEvent.setup();

        const rows = screen.getAllByRole('row');
        const aliceRow = rows.find(row => within(row).queryByText('Alice'));
        expect(aliceRow).toBeDefined();
        const buttons = within(aliceRow!).getAllByRole('button');
        const editBtn = buttons[0];

        await user.click(editBtn);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Edit Contact')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();

        await user.clear(screen.getByLabelText(/Name/i));
        await user.type(screen.getByLabelText(/Name/i), 'Alice Updated');

        await user.click(screen.getByRole('button', { name: /Save Changes/i }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Alice Updated')).toBeInTheDocument();
    });

    it('deletes a contact', async () => {
        renderWithProviders(<HomePage />, { preloadedState });
        const user = userEvent.setup();

        const rows = screen.getAllByRole('row');
        const bobRow = rows.find(row => within(row).queryByText('Bob'));

        const deleteBtn = within(bobRow!).getAllByRole('button')[1];
        await user.click(deleteBtn);

        expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();

        const confirmBtn = screen.getByRole('button', { name: /Delete/i });
        await user.click(confirmBtn);

        await waitFor(() => {
            expect(screen.queryByText('Bob')).not.toBeInTheDocument();
        });
    });

    it('sorts contacts by name', async () => {
        renderWithProviders(<HomePage />, { preloadedState });
        const user = userEvent.setup();

        const rows = screen.getAllByRole('row').slice(1);
        expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
        expect(within(rows[1]).getByText('Bob')).toBeInTheDocument();

        const nameHeader = screen.getByRole('button', { name: /Name/i });
        await user.click(nameHeader);

        await waitFor(() => {
            const rowsAfterClick = screen.getAllByRole('row').slice(1);
            expect(within(rowsAfterClick[0]).getByText('Alice')).toBeInTheDocument();
            expect(within(rowsAfterClick[1]).getByText('Bob')).toBeInTheDocument();
        });

        await user.click(nameHeader);

        await waitFor(() => {
            const rowsAfterSecondClick = screen.getAllByRole('row').slice(1);
            expect(within(rowsAfterSecondClick[0]).getByText('Bob')).toBeInTheDocument();
            expect(within(rowsAfterSecondClick[1]).getByText('Alice')).toBeInTheDocument();
        });

        await user.click(nameHeader);

        await waitFor(() => {
            const rowsAfterThirdClick = screen.getAllByRole('row').slice(1);
            expect(within(rowsAfterThirdClick[0]).getByText('Alice')).toBeInTheDocument();
            expect(within(rowsAfterThirdClick[1]).getByText('Bob')).toBeInTheDocument();
        });
    });
});
