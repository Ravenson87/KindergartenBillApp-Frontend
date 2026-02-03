// src/types.ts

export type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

export type Activity = {
    id: number;
    name: string;
    price: number;      // backend uvek vraća broj
    status: boolean;    // backend uvek vraća true/false
};

export type Group = {
    id: number;
    name: string;
    price: number;      // backend uvek vraća broj
    discount: number;   // backend uvek vraća broj (može biti 0)
    active: boolean;    // backend uvek vraća true/false
};

export type Kindergarten = {
    id: number;
    name: string;
    address: string;        // obavezno
    phoneNumber: string;    // obavezno
    email: string;          // obavezno
    logo?: string;          // može biti null → ostaje opcionalno
    activities: Activity[]; // uvek niz (makar prazan)
    groups: Group[];        // uvek niz (makar prazan)
};

export type KindergartenAccount = {
    id: number;
    bank_name: string;
    account_number: string;
    pib: string;
    identification_number: string;
    activity_code?: number;
    kindergarten: { id: number; name?: string };
};



