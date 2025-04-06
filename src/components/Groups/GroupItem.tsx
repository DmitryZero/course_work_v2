import { useState } from "react";
import { TGroup } from "../../interfaces/TGroup";
import { Button, Collapse, IconButton, Paper, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import UserSelector from "../Users/UserSelector";
import GroupSelector from "./GroupSelector";
import ElementList from "../Elements/ElementList";
import ElementSelector from "../Elements/ElementsSelector";

type TProps = {
    group: TGroup
}

export default function GroupItem({ group }: TProps) {
    const [is_open, setOpenGroup] = useState<boolean>(false);
    const [currrent_group, setCurrentGroup] = useState<TGroup>(group);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentGroup({ ...currrent_group, [e.target.name]: e.target.value });
    }

    return (
        <>
            <Paper className="p-4">
                <h3 className="font-semibold">
                    {currrent_group.name}
                    <Button
                        sx={{ ml: 2 }}
                        size="small"
                        onClick={() => setOpenGroup(!is_open)}
                    >
                        {is_open ? "Скрыть" : "Развернуть"}
                    </Button>
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </h3>

                <Collapse in={is_open}>
                    <TextField
                        label="Название группы"
                        name="name"
                        value={currrent_group.name}
                        fullWidth
                        sx={{ mt: 2 }}
                        onChange={handleChange}
                    />
                    <UserSelector default_users={group.users} />
                    <GroupSelector initial_group={group.parent_group} field_name="Родительская группа" chooseGroup={(g) => g} />
                    <div>
                        <h3 className="font-bold mt-2">
                            Чтение
                            <ElementSelector />
                        </h3>
                        <h3 className="font-bold mt-2">
                            Редактирование
                            <ElementSelector />
                        </h3>
                        <h3 className="font-bold mt-2">
                            Удаление
                            <ElementSelector />
                        </h3>
                    </div>

                    

                    <Button sx={{ mt: 2 }} variant="contained" color="primary">
                        Обновить
                    </Button>
                </Collapse>
            </Paper>
        </>
    );
}