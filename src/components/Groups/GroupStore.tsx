import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { TGroup } from '../../interfaces/TGroup';
import { useNotificationStore } from '../General/NotificationStore';
import sendMessage from '../../utility/sendMessage';

interface GroupDataStore {
    groups: TGroup[],
    createGroup: (new_group: TGroup) => void,
    updateGroup: (update_item: TGroup) => void,
    deleteGroup: (item_to_delete: TGroup) => void,
    fetchGroups: (groups: TGroup[]) => void,
}

export const useGroupStore = create<GroupDataStore>()(devtools(immer((set) => ({
    groups: [],
    createGroup: (new_item) => set(state => {
        state.groups.push(new_item);

        sendMessage(`Группа "${new_item.name}" успешно создана`);
    }),
    updateGroup: (update_item) => set(state => {
        const item_to_update_index = state.groups.findIndex(e => e.id === update_item.id);
        if (item_to_update_index === -1) throw new Error(`updateElement not found`);

        state.groups[item_to_update_index] = update_item;
        sendMessage(`Группа "${update_item.name}" успешно обновлена`);
    }),
    deleteGroup: (item_to_delete) => set(state => {
        state.groups = state.groups.filter(i => i.id !== item_to_delete.id);
        sendMessage(`Группа "${item_to_delete.name}" успешно удалена`);
    }),
    fetchGroups: (fetched_groups: TGroup[]) => {
        set({ groups: fetched_groups })
    }
}))));