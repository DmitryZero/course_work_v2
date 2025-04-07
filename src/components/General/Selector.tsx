import { useState } from "react";
import { TUser } from "../../interfaces/TUser";
import { useUserStore } from "./UserStore";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Autocomplete, Checkbox, TextField } from "@mui/material";

type TProps<T> = {
    value?: T | null
    onUsersChange?: (new_values: T[] | null) => void,
    variants: T extends (infer U)[] ? U[] : T[],
    is_multiple?: boolean
    // updateElementList: Act<TElement[]>
}

export default function UserSelector<T>({ value, onUsersChange, variants, is_multiple }: TProps<T>) {
    const [selected_value, setSelectedValues] = useState<T | undefined>(value || undefined);

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
        <Autocomplete
            multiple
            options={variants}
            value={selected_value}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                    <li key={key} {...optionProps}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </li>
                );
            }}
            style={{ width: 500 }}
            renderInput={(params) => (
                <TextField sx={{ mt: 2 }} {...params} label="Пользователи" />
            )}
            onChange={(event: any, newValue: TUser[] | null) => {
                setSelectedValues(newValue || []);
                if (onUsersChange) onUsersChange(newValue);
            }}
            sx={{ mt: 2 }}
        />
    );
}