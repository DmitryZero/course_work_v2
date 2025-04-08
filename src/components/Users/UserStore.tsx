import { create } from 'zustand';
import { TUser } from '../../interfaces/TUser';
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { userController } from '../../controllers/UserController';

interface UserDataStore {
    users: TUser[];
    currentUser: TUser | null;
    setCurrentUser: (current_user: TUser | null) => void;
    fetchUsers: (users: TUser[]) => void;
}

export const useUserStore = create<UserDataStore>()(devtools(immer((set) => ({
    users: [],
    currentUser: null,
    setCurrentUser: (current_user: TUser | null) => {
        set({ currentUser: current_user })
    },
    fetchUsers: async (fetched_users: TUser[]) => {
        set({ users: fetched_users })
        set({ currentUser: fetched_users[0] })
        await userController.getUsers();
    }
}))));