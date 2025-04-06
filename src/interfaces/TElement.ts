import { TGroup } from "./TGroup";

export type TElement = {
    id: string,
    name: string;
    description: string,
    permissions: {
        read?: TGroup | undefined,
        write?: TGroup | undefined,
        delete?: TGroup | undefined,
    }
};