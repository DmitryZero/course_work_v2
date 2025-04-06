import DeleteIcon from '@mui/icons-material/Delete';
import { TElement } from '../../interfaces/TElement';
import { useState } from 'react';
import { TGroup } from '../../interfaces/TGroup';
import { Button, Collapse, FormGroup, IconButton, Paper, TextField } from '@mui/material';
import GroupSelector from '../Groups/GroupSelector';

type TProps = {
    element: TElement,
    is_readonly?: boolean
}

export default function ElementItem({ element, is_readonly}: TProps) {
    const [is_open, setOpenElements] = useState<boolean>(false);

    const toggleElement = (id: string) => {
        setOpenElements((prev) => !prev);
    };

    const [currrent_element, setCurrentElement] = useState<TElement>(element);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentElement({ ...currrent_element, [e.target.name]: e.target.value });
    }

    function handlePermissionChange(permission: "read" | "write" | "delete", group: TGroup) {
        setCurrentElement((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permission]: group
            },
        }));
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
                        <IconButton aria-label="delete">
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
                        <GroupSelector is_read_only={is_readonly} initial_group={currrent_element.permissions.read} field_name="Чтение" chooseGroup={(g) => handlePermissionChange("read", g)} />
                        <GroupSelector is_read_only={is_readonly} initial_group={currrent_element.permissions.write} field_name="Редактирование" chooseGroup={(g) => handlePermissionChange("write", g)} />
                        <GroupSelector is_read_only={is_readonly} initial_group={currrent_element.permissions.delete} field_name="Удаление" chooseGroup={(g) => handlePermissionChange("delete", g)} />
                    </FormGroup>
                    <Button sx={{ mt: 2 }} variant="contained" color="primary">
                        Обновить
                    </Button>
                </Collapse>
            </Paper>
        </>
    );
}