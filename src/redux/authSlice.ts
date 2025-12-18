import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


interface User {
  name: string;
  email: string;
}


interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
}


const getInitialState = (): AuthState => {
  const storedUser = localStorage.getItem('currentUser');
  const storedUsers = localStorage.getItem('users');
  const storedAuth = localStorage.getItem('isAuthenticated');

  return {
    currentUser: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: storedAuth === 'true',
    users: storedUsers ? JSON.parse(storedUsers) : [],
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      localStorage.setItem('users', JSON.stringify(state.users));
    },
    login: (state, action: PayloadAction<string>) => {
      const email = action.payload;
      const user = state.users.find((u) => u.email === email);

      if (user) {
        state.currentUser = user;
        state.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        console.warn('User not found');
      }
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    },
  },
});

export const { register, login, logout } = authSlice.actions;

export default authSlice.reducer;
