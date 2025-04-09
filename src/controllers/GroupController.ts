import { dbController } from "../components/dbController/dbController";
import GroupDto from "../dto/Groupdto";

export const GroupController = {
    async getGroups() {
        const groups_db_data = await dbController.sendSQLRequest("SELECT *, (SELECT expand(inE()) FROM $current) as IN_EDGES, (SELECT expand(outE()) FROM $current) as OUT_EDGES FROM Group");
        return GroupDto(groups_db_data);
    }
}