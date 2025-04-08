import DeleteIcon from '@mui/icons-material/Delete';
import { TElement } from '../../interfaces/TElement';
import { useEffect, useState } from 'react';
import { TGroup } from '../../interfaces/TGroup';
import { Button, Collapse, FormGroup, IconButton, Paper, TextField } from '@mui/material';
import GroupSelector from '../Groups/GroupSelector';
import { TPermissionGroups } from '../../interfaces/TPermissionGroups';

type TProps = {
    element: TElement,
    is_readonly?: boolean
    groups?: TGroup[],
    updateItem?: (update_item: TElement) => void
    deleteElement?: (item_to_delete: TElement) => void,
}

export default function ElementItem({ element, is_readonly, groups, updateItem, deleteElement }: TProps) {
    const [is_open, setOpenElements] = useState<boolean>(false);

    const toggleElement = (id: string) => {
        setOpenElements((prev) => !prev);
    };

    const [currrent_element, setCurrentElement] = useState<TElement>(element);
    const [current_permissions, setPermission] = useState<TPermissionGroups>(element.permissions || {
        read: null,
        write: null,
        delete: null
    });

    useEffect(() => {
        setPermission(element.permissions || {
            read: null,
            write: null,
            delete: null
        });
    }, [element.permissions]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentElement({ ...currrent_element, [e.target.name]: e.target.value });
    }

    const handlePermissionUpdate = (group: TGroup | null, field_name?: string) => {
        if (field_name === "Чтение") setPermission({...current_permissions, read: group});
        else if (field_name === "Редактирование") setPermission({...current_permissions, write: group});
        else setPermission({...current_permissions, delete: group});
    }

    const handleUpdate = () => {
        if (updateItem) updateItem({ ...currrent_element, permissions: current_permissions });
    }

    const handleDelete = () => {
        console.log("handleDelete");
        if (deleteElement) deleteElement(currrent_element)
    }

    return (
        <>
            <Paper className="p-4" sx={{ mt: 2 }}>
                <h3 className="font-semibold">
                    {currrent_element.name}
                    <Button
                        sx={{ ml: 2 }}
                        size="small"
                        onClick={() => toggleElement(currrent_element.id)}
                    >
                        {is_open ? "Скрыть" : "Развернуть"}
                    </Button>
                    {
                        !is_readonly &&
                        <IconButton aria-label="delete" onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    }
                </h3>

                <Collapse in={is_open}>
                    <TextField
                        label="Название элемента"
                        name="name"
                        value={currrent_element.name}
                        fullWidth
                        sx={{ mt: 2 }}
                        onChange={handleChange}
                        slotProps={{
                            input: {
                                readOnly: is_readonly,
                            },
                        }}
                        variant={is_readonly ? "filled" : "outlined"}
                    />
                    <TextField
                        label="Описание"
                        name="description"
                        value={currrent_element.description}
                        fullWidth
                        sx={{ mt: 2 }}
                        onChange={handleChange}
                        slotProps={{
                            input: {
                                readOnly: is_readonly,
                            },
                        }}
                        variant={is_readonly ? "filled" : "outlined"}
                    />
                    <FormGroup sx={{ mt: 2, "& > *": { mt: 2 } }}>
                        <GroupSelector is_read_only={is_readonly} value={current_permissions.read} variants={groups || []} field_name="Чтение" setValue={handlePermissionUpdate} />
                        <GroupSelector is_read_only={is_readonly} value={current_permissions.write} variants={groups || []} field_name="Редактирование" setValue={handlePermissionUpdate} />
                        <GroupSelector is_read_only={is_readonly} value={current_permissions.delete} variants={groups || []} field_name="Удаление" setValue={handlePermissionUpdate} />
                    </FormGroup>
                    <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={handleUpdate}>
                        Обновить
                    </Button>
                </Collapse>
            </Paper>
        </>
    );
}