import { useGroupStore } from "../components/Groups/GroupStore";
import { useUserStore } from "../components/Users/UserStore";
import { IBaseEdge, IBaseNode } from "../interfaces/IBase";
import { TGroup } from "../interfaces/TGroup";
import { TResponse } from "../interfaces/TResponse";

interface IEdgeData {
    is_read: boolean,
    is_write: boolean,
    is_delete: boolean,
} 

interface IGroupDBNode extends IBaseNode<IEdgeData> {
    name: string
}


export default function GroupDto(input_data: any) {
    const data: TResponse<IGroupDBNode> = input_data;
    const obj = data.result.map(i => <TGroup>{
        id: i["@rid"],
        name: i.name,
        users_ids: i.IN_EDGES?.filter(e => e["@class"] === "MEMBER_OF").map(o => o.out),
        parent_group_id: i.OUT_EDGES?.find(e => e["@class"] === "BELONGS_TO")?.in,
        permissions: {
            read_ids: i.OUT_EDGES?.filter(e => e["@class"] === "HAS_PERMISSION" && e.is_read).map(e => e.in),
            write_ids: i.OUT_EDGES?.filter(e => e["@class"] === "HAS_PERMISSION" && e.is_write).map(e => e.in),
            delete_ids: i.OUT_EDGES?.filter(e => e["@class"] === "HAS_PERMISSION" && e.is_delete).map(e => e.in)
        }
    })
 
    return obj;
}