import { useElementStore } from "../Elements/ElementStore";
import { useUserStore } from "../Users/UserStore";
import GroupItem from "./GroupItem";
import { useGroupStore } from "./GroupStore";

export default function GroupList() {
    const all_users = useUserStore(state => state.users);
    const all_groups = useGroupStore(state => state.groups);
    const all_elements = useElementStore(state => state.elements);

    const updateGroup = useGroupStore(state => state.updateGroup);
    const deleteGroup = useGroupStore(state => state.deleteGroup);

    return (
        <>
            <h2 className="text-xl font-bold">Список групп</h2>
            {all_groups.map((group) => (
                <GroupItem key={group.id} group={group} all_users={all_users} all_elements={all_elements} all_groups={all_groups} updateGroup={updateGroup} deleteGroup={deleteGroup} />
            ))}
        </>
    );
}