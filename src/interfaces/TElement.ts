import { TGroup } from "./TGroup";
import { TPermissionGroups } from "./TPermissionGroups";

export type TElement = {
    id: string,
    name: string;
    description: string,
    permissions?: TPermissionGroups
};