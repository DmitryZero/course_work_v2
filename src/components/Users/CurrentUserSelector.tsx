import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useUserStore } from "./UserStore";
import { TUser } from "../../interfaces/TUser";

export default function CurrentUserSelector() {
    const users = useUserStore(state => state.users);
    const current_user = useUserStore(state => state.currentUser);
    const setCurrentUser = useUserStore(state => state.setCurrentUser);

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
        <Autocomplete
            options={users}
            value={current_user}
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
                <TextField {...params} label={"Текущий пользователь"} />
            )}
            onChange={(event: any, newValue: TUser | null) => {
                if (newValue === null) return;
                setCurrentUser(newValue)
            }}
            sx={{ mt: 2 }}
        />
    );
}