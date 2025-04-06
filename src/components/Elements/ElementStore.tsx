import { create } from 'zustand';
import { TElement } from '../../interfaces/TElement';
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface ElementDataStore {
    elements: TElement[],
    createElement: (new_item: TElement) => void,
    fetchElements: (items: TElement[]) => void,
}

export const useElementStore = create<ElementDataStore>()(devtools(immer((set) => ({
    elements: [],
    createElement: (new_item) => set(state => {
        state.elements.push(new_item)
    }),
    fetchElements: (fetched_elements: TElement[]) => {
        set({ elements: fetched_elements })
    }
}))));