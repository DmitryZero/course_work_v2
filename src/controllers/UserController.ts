import { TElement } from "../interfaces/TElement";
import { sendSQLMessage } from "../utility/sendSQLMessage";

export const userController = {
    async getUsers() {
        const users_db_data = await sendSQLMessage("select * from User");
        console.log(users_db_data);
    }
}