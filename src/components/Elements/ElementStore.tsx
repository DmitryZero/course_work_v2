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
    updateElement: async (new_item) => {
        await ElementController.updateElement(new_item);

        set((state) => {
            const item_to_update_index = state.elements.findIndex(e => e.id === new_item.id);
            if (item_to_update_index === -1) throw new Error(`updateElement not found`);

            state.elements[item_to_update_index] = new_item;
            sendMessage(`Элемент "${new_item.name}" успешно обновлён`);
        })
    },
    deleteElement: async (item_to_delete) => {
        await ElementController.deleteElement(item_to_delete);

        set((state) => {
            state.elements = state.elements.filter(i => i.id !== item_to_delete.id);

            useGroupStore.getState().removeElement(item_to_delete);
            sendMessage(`Элемент "${item_to_delete.name}" успешно удалён`);
        })
    },
    fetchElements: async () => {
        const elements_db = await ElementController.getElements();
        set({ elements: elements_db });
    },
    removeGroup: (group: TGroup) => set(state => {
        const elements = state.elements.map(element => {
            if (!element.permissions) return element;

            element.permissions.read_ids = element.permissions.read_ids?.filter(g => g !== group.id) || null;
            element.permissions.write_ids = element.permissions.write_ids?.filter(g => g !== group.id) || null;
            element.permissions.delete_ids = element.permissions.delete_ids?.filter(g => g !== group.id) || null;

            return element;
        })

        set({ elements: elements });
    }),
}))));