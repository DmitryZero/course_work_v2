import { create } from 'zustand';
import { TUser } from '../../interfaces/TUser';
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { UserController } from '../../controllers/UserController';
import { useElementStore } from '../Elements/ElementStore';

interface UserDataStore {
    users: TUser[];
    currentUser: TUser | null;
    setCurrentUser: (current_user: TUser | null) => void;
    fetchUsers: () => void;
}

export const useUserStore = create<UserDataStore>()(devtools(immer((set) => ({
    users: [],
    currentUser: null,
    setCurrentUser: (current_user: TUser | null) => {
        set({ currentUser: current_user });
        useElementStore.getState().fetchElements();
    },
    fetchUsers: async () => {
        const users_db = await UserController.getUsers();
        set({ users: users_db });
        if (users_db.length > 0) set({ currentUser: users_db[0] })
    }
}))));