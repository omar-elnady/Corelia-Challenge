import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { addContact, updateContact, deleteContact, type Contact } from '@/redux/contactsSlice';
import type { RootState } from '@/redux/store';
import { Plus } from 'lucide-react';
import Header from '@/components/Header';
import Table from '@/components/table';
import { ContactFormDialog, type ContactFormValues } from '@/components/contacts/ContactFormDialog';
import { DeleteConfirmationDialog } from '@/components/contacts/DeleteConfirmationDialog';

export default function HomePage() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const { contacts } = useSelector((state: RootState) => state.contacts);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [contactToDelete, setContactToDelete] = useState<string | null>(null);

    const [sortBy, setSortBy] = useState<'order' | 'name'>(() => {
        const saved = localStorage.getItem('contacts_sortBy');
        return (saved === 'order' || saved === 'name') ? saved : 'order';
    });
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
        const saved = localStorage.getItem('contacts_sortOrder');
        return (saved === 'asc' || saved === 'desc') ? saved : 'asc';
    });
    const [currentPage, setCurrentPage] = useState(() => {
        const saved = localStorage.getItem('contacts_currentPage');
        return saved ? parseInt(saved, 10) : 1;
    });
    const [itemsPerPage] = useState(5);

    useEffect(() => localStorage.setItem('contacts_sortBy', sortBy), [sortBy]);
    useEffect(() => localStorage.setItem('contacts_sortOrder', sortOrder), [sortOrder]);
    useEffect(() => localStorage.setItem('contacts_currentPage', String(currentPage)), [currentPage]);

    const userContacts = useMemo(() => {
        return contacts.filter(c => c.userId === currentUser?.email);
    }, [contacts, currentUser?.email]);

    const sortedContacts = useMemo(() => {
        return [...userContacts].sort((a, b) => {
            if (sortBy === 'order') {
                return sortOrder === 'asc' ? a.order - b.order : b.order - a.order;
            } else {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
        });
    }, [userContacts, sortBy, sortOrder]);

    const totalPages = useMemo(() => Math.ceil(sortedContacts.length / itemsPerPage), [sortedContacts.length, itemsPerPage]);
    const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);
    const currentData = useMemo(() => sortedContacts.slice(startIndex, startIndex + itemsPerPage), [sortedContacts, startIndex, itemsPerPage]);
    const openAddModal = useCallback(() => {
        setEditingContact(null);
        setIsFormOpen(true);
    }, []);

    const openEditModal = useCallback((contact: Contact) => {
        setEditingContact(contact);
        setIsFormOpen(true);
    }, []);

    const onSubmit = useCallback((data: ContactFormValues) => {
        if (!currentUser) return;

        if (editingContact) {
            dispatch(updateContact({
                id: editingContact.id,
                userId: currentUser.email,
                name: data.name,
                phoneNumber: data.phoneNumber,
                order: editingContact.order
            }));
            toast.success("Contact updated successfully");
        } else {
            const nextOrder = userContacts.length + 1;
            dispatch(addContact({
                id: crypto.randomUUID(),
                userId: currentUser.email,
                name: data.name,
                phoneNumber: data.phoneNumber,
                order: nextOrder
            }));
            toast.success("Contact added successfully");
            const newTotalPages = Math.ceil((userContacts.length + 1) / itemsPerPage);
            setCurrentPage(newTotalPages);
        }
        setIsFormOpen(false);
    }, [currentUser, editingContact, dispatch, userContacts.length, itemsPerPage]);

    const confirmDelete = useCallback((id: string) => {
        setContactToDelete(id);
        setIsDeleteOpen(true);
    }, []);

    const executeDelete = useCallback(() => {
        if (contactToDelete) {
            dispatch(deleteContact(contactToDelete));
            toast.success("Contact deleted successfully");
            setIsDeleteOpen(false);
            setContactToDelete(null);

            const itemsOnCurrentPage = sortedContacts.slice(startIndex, startIndex + itemsPerPage).length;
            if (itemsOnCurrentPage === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
        }
    }, [contactToDelete, dispatch, sortedContacts, startIndex, itemsPerPage, currentPage]);
    const toggleSortByOrder = useCallback(() => {
        if (sortBy === 'order') {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy('order');
            setSortOrder('asc');
        }
    }, [sortBy]);

    const toggleSortByName = useCallback(() => {
        if (sortBy === 'name') {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy('name');
            setSortOrder('asc');
        }
    }, [sortBy]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 sm:px-20 py-4 sm:py-6 space-y-4 sm:space-y-6">
                <Header title="Contacts" />
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 sm:h-10">
                    <div className='border px-3 sm:px-4 flex items-center bg-gray-50 rounded border-gray-200 h-10 sm:h-full'>
                        <p className="text-sm sm:text-base">
                            You have <span className="font-semibold text-teal-700"> {userContacts.length}</span> contacts
                        </p>
                    </div>
                    <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white h-10 sm:h-full whitespace-nowrap">
                        <Plus className="mr-2 !h-5 !w-5 rounded-full border-2 border-gray-200" /> Add Contact
                    </Button>
                </div>

                <Table
                    data={currentData}
                    columns={[
                        { key: 'order', label: 'Order', sortable: true, onSort: toggleSortByOrder },
                        { key: 'name', label: 'Name', sortable: true, onSort: toggleSortByName },
                        { key: 'phoneNumber', label: 'Number' }
                    ]}
                    onEdit={openEditModal}
                    onDelete={confirmDelete}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    startIndex={startIndex}
                    totalItems={sortedContacts.length}
                    itemsPerPage={itemsPerPage}
                    sortOrder={sortOrder}
                    sortBy={sortBy}
                    noDataMessage="No contacts found"
                />
            </main>

            <ContactFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                editingContact={editingContact}
                onSave={onSubmit}
                existingContacts={userContacts}
            />

            <DeleteConfirmationDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={executeDelete}
            />
        </div>
    );
}
