import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phoneNumber: string;
  order: number;
}

interface ContactsState {
  contacts: Contact[];
}
const getInitialState = (): ContactsState => {
  const storedContacts = localStorage.getItem("contacts");
  return {
    contacts: storedContacts ? JSON.parse(storedContacts) : [],
  };
};

const initialState: ContactsState = getInitialState();

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<Contact>) => {
      state.contacts.push(action.payload);
      localStorage.setItem("contacts", JSON.stringify(state.contacts));
    },
    updateContact: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
        localStorage.setItem("contacts", JSON.stringify(state.contacts));
      }
    },
    deleteContact: (state, action: PayloadAction<string>) => {
      const contactToDelete = state.contacts.find(
        (c) => c.id === action.payload
      );
      if (contactToDelete) {
        const remainingContacts = state.contacts.filter(
          (c) => c.id !== action.payload
        );
        const userContacts = remainingContacts
          .filter((c) => c.userId === contactToDelete.userId)
          .sort((a, b) => a.order - b.order)
          .map((c, index) => ({ ...c, order: index + 1 }));
        const otherContacts = remainingContacts.filter(
          (c) => c.userId !== contactToDelete.userId
        );
        state.contacts = [...otherContacts, ...userContacts];

        localStorage.setItem("contacts", JSON.stringify(state.contacts));
      }
    },
  },
});

export const { addContact, updateContact, deleteContact } =
  contactsSlice.actions;

export default contactsSlice.reducer;
