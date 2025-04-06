import GroupItem from "./GroupItem";
import { useGroupStore } from "./GroupStore";

export default function GroupList() {
    const groups = useGroupStore(state => state.groups);

    return (
        <>
            <h2 className="text-xl font-bold">Список групп</h2>
            {groups.map((group) => (
                <GroupItem key={group.id} group={group} />
            ))}
        </>
    );
}