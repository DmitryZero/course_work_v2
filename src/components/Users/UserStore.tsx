import { create } from 'zustand';
import { TUser } from '../../interfaces/TUser';
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { UserController } from '../../controllers/UserController';
import { useElementStore } from '../Elements/ElementStore';
import { useGroupStore } from '../Groups/GroupStore';

interface UserDataStore {
    users: TUser[];
    currentUser: TUser | null;
    element_to_update: string[] | null;
    element_to_delete: string[] | null;
    setItemsToFilter: (input_data: { write_ids: string[], delete_ids: string[] }) => void,
    setCurrentUser: (current_user: TUser | null) => void;
    fetchUsers: () => void;
}

export const useUserStore = create<UserDataStore>()(devtools(immer((set) => ({
    users: [],
    element_to_read: [],
    element_to_update: [],
    element_to_delete: [],
    currentUser: null,
    setItemsToFilter(input_data) {
        set({ element_to_update: input_data.write_ids, element_to_delete: input_data.delete_ids });
    },
    setCurrentUser: (current_user: TUser | null) => {
        set({ currentUser: current_user });
        useElementStore.getState().fetchElements();
    },
    fetchUsers: async () => {
        const users_db = await UserController.getUsers();
        set({ users: users_db });
        if (users_db.length > 0) set({ currentUser: users_db[0] })
        useGroupStore.getState().fetchGroups();
    }
}))));