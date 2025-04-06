import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { TGroup } from '../../interfaces/TGroup';

interface GroupDataStore {
    groups: TGroup[],
    createGroup: (new_group: TGroup) => void,
    fetchGroups: (groups: TGroup[]) => void,
}

export const useGroupStore = create<GroupDataStore>()(devtools(immer((set) => ({
    groups: [],
    createGroup: (new_item) => set(state => {
        state.groups.push(new_item)
    }),
    fetchGroups: (fetched_groups: TGroup[]) => {
        set({ groups: fetched_groups })
    }
}))));