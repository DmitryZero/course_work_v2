interface IBase {
    "@type": string;
    "@rid": string;
    "@version": number;
    "@class": string;
}

// Базовый Edge
export interface IBaseEdge {
    out: string;
    in: string;
}

// Универсальный Edge с дополнительными полями
export type IExtendedEdge<T = Record<string, unknown>> = IBase & IBaseEdge & T;

export interface IBaseNode<T = Record<string, unknown>> extends IBase {
    IN_EDGES?: IExtendedEdge<T>[];
    OUT_EDGES?: IExtendedEdge<T>[];
}
