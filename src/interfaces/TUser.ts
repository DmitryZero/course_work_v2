import { TGroup } from "./TGroup";

export type TUser = {
    id: string,
    name: string,
    is_admin?: boolean,
    user_groups?: TGroup[]
};