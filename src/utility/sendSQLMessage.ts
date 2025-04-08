import { TElement } from "../interfaces/TElement";

export const sendSQLMessage = async (SQL: string): Promise<any> => {
    try {
        const url = `${process.env.REACT_APP_DB_URL}:${process.env.REACT_APP_DB_PORT}/command/${process.env.REACT_APP_DB_NAME}/sql`;
        const token = btoa(`${process.env.REACT_APP_ATHOURIZATION_LOGIN}:${process.env.REACT_APP_ATHOURIZATION_PASSWORD}`)

        console.log("url", url);
        console.log("token", token);

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ command: SQL }),
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