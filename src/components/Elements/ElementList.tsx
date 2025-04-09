import { useGroupStore } from "../Groups/GroupStore";
import ElementItem from "./ElementItem";
import { useElementStore } from "./ElementStore";

type TProps = {
    is_readonly?: boolean;
}

export default function ElementList({ is_readonly }: TProps) {
    const elements = useElementStore(state => state.elements);
    const updateItem = useElementStore(state => state.updateElement);
    const deleteItem = useElementStore(state => state.deleteElement);
    const groups = useGroupStore(state => state.groups);

    return (
        <>
            <h2 className="text-xl font-bold">Список элементов</h2>
            {elements.map((element) => (
                <ElementItem key={element.id} element={element} is_readonly={is_readonly} groups={groups} updateItem={updateItem} deleteElement={deleteItem} />
            ))}
        </>
    );
}