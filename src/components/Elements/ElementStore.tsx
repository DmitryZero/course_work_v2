import { create } from 'zustand';
import { TElement } from '../../interfaces/TElement';
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import sendMessage from '../../utility/sendMessage';
import { TGroup } from '../../interfaces/TGroup';
import { useGroupStore } from '../Groups/GroupStore';
import { ElementController } from '../../controllers/elementController';

interface ElementDataStore {
    elements: TElement[],
    createElement: (new_item: TElement) => void,
    updateElement: (update_item: TElement) => void,
    deleteElement: (item_to_delete: TElement) => void,
    fetchElements: () => void,
    removeGroup: (group: TGroup) => void,
}

export const useElementStore = create<ElementDataStore>()(devtools(immer((set) => ({
    elements: [],
    createElement: async (new_item) => {
        const new_item_from_bd = await ElementController.createElement(new_item);
        new_item.id = new_item_from_bd[0].id;
        set((state) => {
            state.elements.push(new_item)
        })
    },
    updateElement: (updated_item) => set(state => {
        const item_to_update_index = state.elements.findIndex(e => e.id === updated_item.id);
        if (item_to_update_index === -1) throw new Error(`updateElement not found`);

        state.elements[item_to_update_index] = updated_item;
        sendMessage(`Элемент "${updated_item.name}" успешно обновлён`);
    }),
    deleteElement: (item_to_delete) => set(state => {
        state.elements = state.elements.filter(i => i.id !== item_to_delete.id);

        useGroupStore.getState().removeElement(item_to_delete);
        sendMessage(`Элемент "${item_to_delete.name}" успешно удалён`);
    }),
    fetchElements: async () => {
        const elements_db = await ElementController.getElements();
        set({ elements: elements_db });
    },
    removeGroup: (group: TGroup) => set(state => {
        const elements = state.elements.map(element => {
            if (!element.permissions) return element;

            // if (element.permissions.read_ids === group.id) element.permissions.read_ids = null;
            // if (element.permissions.write_ids === group.id) element.permissions.write_ids = null;
            // if (element.permissions.delete_ids === group.id) element.permissions.delete_ids = null;

            return element;
        })

        set({ elements: elements });
    }),
}))));