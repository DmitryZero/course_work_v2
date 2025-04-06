import ElementItem from "./ElementItem";
import { useElementStore } from "./ElementStore";

type TProps = {
    is_readonly?: boolean;
}

export default function ElementList({ is_readonly }: TProps) {
    const elements = useElementStore(state => state.elements);

    return (
        <>
            {elements.map((element) => (
                <ElementItem key={element.id} element={element} is_readonly={is_readonly} />
            ))}
        </>
    );
}