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

const reOrderContacts = (contacts: Contact[]) =>
  contacts.map((contact, index) => ({
    ...contact,
    order: index + 1,
  }));

const initialState: ContactsState = getInitialState();

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<Contact>) => {
      state.contacts.push(action.payload);
      state.contacts = reOrderContacts(state.contacts);
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
      state.contacts = reOrderContacts(
        state.contacts.filter((c) => c.id !== action.payload)
      );
      localStorage.setItem("contacts", JSON.stringify(state.contacts));
    },
  },
});

export const { addContact, updateContact, deleteContact } =
  contactsSlice.actions;

export default contactsSlice.reducer;
