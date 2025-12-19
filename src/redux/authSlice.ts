import { createSlice, type PayloadAction, current } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
}

const getInitialState = (): AuthState => {
  const storedUser = localStorage.getItem("currentUser");
  const storedUsers = localStorage.getItem("users");

  return {
    currentUser: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedUser,
    users: storedUsers ? JSON.parse(storedUsers) : [],
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action: PayloadAction<User>) => {
      const exists = state.users.some((u) => u.email === action.payload.email);
      if (!exists) {
        state.users.push(action.payload);
        localStorage.setItem("users", JSON.stringify(current(state.users)));
      }
    },
    login: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      const { email, password } = action.payload;
      const user = state.users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        state.currentUser = user;
        state.isAuthenticated = true;
        localStorage.setItem("currentUser", JSON.stringify(current(user)));
      } else {
        state.currentUser = null;
        state.isAuthenticated = false;
      }
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { register, login, logout } = authSlice.actions;

export default authSlice.reducer;
