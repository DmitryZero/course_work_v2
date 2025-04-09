import { dbController } from "../components/dbController/dbController";
import UserDto from "../dto/Userdto";

export const UserController = {
    async getUsers() {
        const users_db_data = await dbController.sendSQLRequest("select * from User");
        return UserDto(users_db_data);
    }
}