import { dbController } from "../components/dbController/dbController";
import Elementdto from "../dto/Elementdto";
import GroupDto from "../dto/Groupdto";
import { TElement } from "../interfaces/TElement";
import { TGroup } from "../interfaces/TGroup";

type TPermissionsByGroup = {
    elementId: string,
    permissions: {
        read: boolean,
        write: boolean,
        delete: boolean
    }
};

interface IEdgeData {
    is_read: boolean,
    is_write: boolean,
    is_delete: boolean,
}


export const GroupController = {
    async getGroups() {
        const groups_db_data = await dbController.sendSQLRequest("SELECT *, (SELECT expand(inE()) FROM $current) as IN_EDGES, (SELECT expand(outE()) FROM $current) as OUT_EDGES FROM Group");
        return GroupDto(groups_db_data);
    },
    async createGroup(group: TGroup) {
        const requests: string[] = [
            `LET new_group = CREATE VERTEX Group SET name = '${group.name}'`
        ];

        if (group.users_ids) {
            group.users_ids.forEach((u, index) => {
                requests.push(`LET user${index} = SELECT FROM User Where @rid='${u}'`);
                requests.push(`CREATE EDGE MEMBER_OF FROM $user${index} TO $new_group`);
            });
        }

        if (group.parent_group_id) {
            requests.push(`LET parent_group = SELECT FROM Group Where @rid='${group.parent_group_id}'`);
            requests.push(`CREATE EDGE BELONGS_TO FROM $new_group TO $parent_group`);
        }

        requests.push("return $new_group");
        console.log("request", requests);

        const new_group = await dbController.batchSQLRequest(requests);
        console.log("new_group", new_group);
        return GroupDto(new_group);
    },

    async updateGroup(group: TGroup) {
        const requests: string[] = [
            `UPDATE Group SET name='${group.name}' Where @rid='${group.id}'`,
            `LET updated_group = SELECT * FROM Group Where @rid='${group.id}'`,
            `DELETE EDGE MEMBER_OF WHERE in = '${group.id}'`,
            `DELETE EDGE BELONGS_TO WHERE out = '${group.id}'`,
            `DELETE EDGE HAS_PERMISSION WHERE out = '${group.id}'`,
        ];

        if (group.permissions) {
            const final_permissions = transformPermission(group);

            final_permissions.forEach((p, index) => {
                requests.push(`LET element${index} = SELECT FROM Element Where @rid='${p.elementId}'`);
                requests.push(`CREATE EDGE HAS_PERMISSION FROM $updated_group TO $element${index} SET is_read=${p.permissions.read}, is_write=${p.permissions.write}, is_delete=${p.permissions.delete}`);
            });
        }

        if (group.users_ids) {
            group.users_ids.forEach((u, index) => {
                requests.push(`LET user${index} = SELECT FROM User Where @rid='${u}'`);
                requests.push(`CREATE EDGE MEMBER_OF FROM $user${index} TO $updated_group`);
            });
        }

        if (group.parent_group_id) {
            requests.push(`LET parent_group = SELECT FROM Group Where @rid='${group.parent_group_id}'`);
            requests.push(`CREATE EDGE BELONGS_TO FROM $updated_group TO $parent_group`);
        }
        console.log("request", requests);

        const resp = await dbController.batchSQLRequest(requests);
        console.log("updateGroup resp", resp);
        return;
    },

    async deleteGroup(group: TGroup) {
        const delete_req = await dbController.sendSQLRequest(`DELETE VERTEX FROM Group WHERE @rid='${group.id}'`);
        console.log("delete_req", delete_req);
    }
}

function transformPermission(group: TGroup) {
    const final_permissions: TPermissionsByGroup[] = [];

    const element_ids = [...group.permissions!.read_ids || [], ...group.permissions!.write_ids || [], ...group.permissions!.delete_ids || []].flat();
    const unique_elements_ids = Array.from(new Set(element_ids));
    unique_elements_ids.forEach(e => {
        const current_permissions: TPermissionsByGroup = {
            elementId: e,
            permissions: {
                read: false,
                write: false,
                delete: false
            }
        }

        current_permissions.permissions.read = group.permissions?.read_ids?.some(i => i === e) === true;
        current_permissions.permissions.write = group.permissions?.write_ids?.some(i => i === e) === true;
        current_permissions.permissions.delete = group.permissions?.delete_ids?.some(i => i === e) === true;
        final_permissions.push(current_permissions);
    })

    return final_permissions;
}