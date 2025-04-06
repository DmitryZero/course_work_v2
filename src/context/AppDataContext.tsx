import { create } from 'zustand';
import { TUser } from '../interfaces/TUser';
import { TGroup } from '../interfaces/TGroup';
import { TElement } from '../interfaces/TElement';

interface AppDataStore {
    users: TUser[];
    current_user: TUser | null;
    groups: TGroup[];
    current_groups: TGroup[];
    elements: TElement[];

    createGroup: (group: TGroup) => void;
    updateGroup: (group: TGroup) => void;
    createElement: (element: TElement) => void;
    updateElement: (element: TElement) => void;
    updateCurrentUser: (user: TUser | null) => void;
}

export const useAppDataStore = create<AppDataStore>((set) => ({
    users: [],
    current_user: null,
    groups: [],
    current_groups: [],
    elements: [],

    createGroup: (group) =>
        set((state) => ({ groups: [...state.groups, group] })),

    updateGroup: (group) =>
        set((state) => ({
            groups: state.groups.map(g => g.id === group.id ? { ...g, ...group } : g)
        })),

    createElement: (element) =>
        set((state) => ({ elements: [...state.elements, element] })),

    updateElement: (element) =>
        set((state) => ({
            elements: state.elements.map(e => e.id === element.id ? { ...e, ...element } : e)
        })),

    updateCurrentUser: (user) =>
        set({ current_user: user }),
}));

// Селекторные хуки для оптимизации подписок
export const useUsers = () => useAppDataStore(state => state.users);
export const useCurrentUser = () => useAppDataStore(state => state.current_user);
export const useGroups = () => useAppDataStore(state => state.groups);
export const useCurrentGroups = () => useAppDataStore(state => state.current_groups);
export const useElements = () => useAppDataStore(state => state.elements);

export const useGroupActions = () =>
    useAppDataStore(state => ({
        createGroup: state.createGroup,
        updateGroup: state.updateGroup,
    }));

export const useElementActions = () =>
    useAppDataStore(state => ({
        createElement: state.createElement,
        updateElement: state.updateElement,
    }));

export const useUserActions = () =>
    useAppDataStore(state => ({
        updateCurrentUser: state.updateCurrentUser,
    }));

// Инициализация начального состояния (если нужно)
export const initializeStore = (initialData?: Partial<AppDataStore>) => {
    useAppDataStore.setState({
        users: initialData?.users || [],
        groups: initialData?.groups || [],
        current_user: initialData?.current_user
        // ... остальные поля
    });
};