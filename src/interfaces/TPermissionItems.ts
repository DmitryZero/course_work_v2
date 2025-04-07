import { TElement } from "./TElement";

export type TPermissionElements = {
    read: TElement[] | null,
    write: TElement[] | null,
    delete: TElement[] | null,
}