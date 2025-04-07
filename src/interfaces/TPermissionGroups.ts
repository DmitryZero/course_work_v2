import { TGroup } from "./TGroup";

export type TPermissionGroups = {
    read: TGroup | null,
    write: TGroup | null,
    delete: TGroup | null,
}