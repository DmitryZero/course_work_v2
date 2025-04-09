import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { TGroup } from '../../interfaces/TGroup';
import { useNotificationStore } from '../General/NotificationStore';
import sendMessage from '../../utility/sendMessage';
import { useElementStore } from '../Elements/ElementStore';
import { TElement } from '../../interfaces/TElement';
import { GroupController } from '../../controllers/GroupController';

interface GroupDataStore {
    groups: TGroup[],
    createGroup: (new_group: TGroup) => void,
    updateGroup: (update_item: TGroup) => void,
    deleteGroup: (item_to_delete: TGroup) => void,
    fetchGroups: () => void,
    removeElement: (element: TElement) => void,
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

        useElementStore.getState().removeGroup(item_to_delete);
        sendMessage(`Группа "${item_to_delete.name}" успешно удалена`);
    }),
    fetchGroups: async () => {
        const groups_db = await GroupController.getGroups();
        set({ groups: groups_db });
    },
    removeElement: (element: TElement) => set(state => {
        const updated_groups = state.groups.map(group => {
            if (!group.permissions) return group;
            if (group.permissions.read_ids) group.permissions.read_ids = group.permissions.read_ids.filter(i => i !== element.id);
            if (group.permissions.write_ids) group.permissions.write_ids = group.permissions.write_ids.filter(i => i !== element.id);
            if (group.permissions.delete_ids) group.permissions.delete_ids = group.permissions.delete_ids.filter(i => i !== element.id);

            return group;
        })

        set({ groups: updated_groups });
    }),
}))));