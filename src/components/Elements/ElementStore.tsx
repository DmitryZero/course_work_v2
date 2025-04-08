import { create } from 'zustand';
import { TElement } from '../../interfaces/TElement';
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import sendMessage from '../../utility/sendMessage';
import { TGroup } from '../../interfaces/TGroup';
import { useGroupStore } from '../Groups/GroupStore';

interface ElementDataStore {
    elements: TElement[],
    createElement: (new_item: TElement) => void,
    updateElement: (update_item: TElement) => void,
    deleteElement: (item_to_delete: TElement) => void,
    fetchElements: (items: TElement[]) => void,
    removeGroup: (group: TGroup) => void,
}

export const useElementStore = create<ElementDataStore>()(devtools(immer((set) => ({
    elements: [],
    createElement: (new_item) => set(state => {
        state.elements.push(new_item);
        sendMessage(`Элемент "${new_item.name}" успешно создан`);
    }),
    updateElement: (update_item) => set(state => {
        const item_to_update_index = state.elements.findIndex(e => e.id === update_item.id);
        if (item_to_update_index === -1) throw new Error(`updateElement not found`);

        state.elements[item_to_update_index] = update_item;
        sendMessage(`Элемент "${update_item.name}" успешно обновлён`);
    }),
    deleteElement: (item_to_delete) => set(state => {
        state.elements = state.elements.filter(i => i.id !== item_to_delete.id);
        
        useGroupStore.getState().removeElement(item_to_delete);
        sendMessage(`Элемент "${item_to_delete.name}" успешно удалён`);
    }),
    fetchElements: (fetched_elements: TElement[]) => {
        set({ elements: fetched_elements })
    },
    removeGroup: (group: TGroup) => set(state => {
        const elements = state.elements.map(element => {
            if (!element.permissions) return element;

            if (element.permissions.read?.id === group.id) element.permissions.read = null;
            if (element.permissions.write?.id === group.id) element.permissions.write = null;
            if (element.permissions.delete?.id === group.id) element.permissions.delete = null;

            return element;
        })

        set({elements: elements});
    }),
}))));