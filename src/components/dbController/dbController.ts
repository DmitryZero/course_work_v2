import { TResponse } from "../../interfaces/TResponse";

export const dbController = {
    async sendSQLRequest(sql_string: string) {
        try {
            const url = `${process.env.REACT_APP_DB_URL}:${process.env.REACT_APP_DB_PORT}/command/${process.env.REACT_APP_DB_NAME}/sql`;
            const token = btoa(`${process.env.REACT_APP_ATHOURIZATION_LOGIN}:${process.env.REACT_APP_ATHOURIZATION_PASSWORD}`)
            
            console.log("body", { command: sql_string })

            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({ command: sql_string }),
                headers: {
                    "Authorization": `Basic ${token}`
                }
            })            

            const json = await response.json();            
            return json;

        } catch (e: any) {
            throw new Error(e.message);
        }
    },

    async batchSQLRequest(sql_commands: string[]) {
        try {
            const url = `${process.env.REACT_APP_DB_URL}:${process.env.REACT_APP_DB_PORT}/batch/${process.env.REACT_APP_DB_NAME}`;
            const token = btoa(`${process.env.REACT_APP_ATHOURIZATION_LOGIN}:${process.env.REACT_APP_ATHOURIZATION_PASSWORD}`)

            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    "transaction": true,
                    "operations": [
                        {
                            "type": "script",
                            "language": "sql",
                            "script": sql_commands
                        }
                    ]
                }),
                headers: {
                    "Authorization": `Basic ${token}`
                }
            })

            const json = await response.json();            
            return json;

        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}