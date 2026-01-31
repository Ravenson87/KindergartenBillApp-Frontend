// src/types.ts
export type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

export type Activity = { id: number; name: string; price?: number; status?: boolean };
export type Group = { id: number; name: string; price?: number; discount?: number; active?: boolean };

export type Kindergarten = {
    id: number;
    name: string;
    address?: string;
    phone_number?: string;
    email?: string;
    logo?: string;
    group?: Group[];
    activities?: Activity[];
};
