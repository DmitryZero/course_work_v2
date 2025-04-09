import { TGroup } from "./TGroup";

export type TPermissionGroups = {
    read_ids: string[] | null,
    write_ids: string[] | null,
    delete_ids: string[] | null,
}