import { TElement } from "./TElement";
import { TPermissionElements } from "./TPermissionItems";
import { TUser } from "./TUser";

export type TGroup = {
    id: string,
    name: string,
    parent_group_id?: string | null,
    users_ids?: string[],   
    permissions?: TPermissionElements 
};