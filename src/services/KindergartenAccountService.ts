import api from "./api";

export const KindergartenAccountService = {
    create: (data: any) => api.post("/kindergarten-account", data),
    getAll: (page = 0, size = 10) => api.get(`/kindergarten-account?page=${page}&size=${size}`),
    getById: (id: number) => api.get(`/kindergarten-account/${id}`),
    getByAccountNumber: (accountNumber: string) => api.get(`/kindergarten-account/account/${accountNumber}`),
    getByIdentificationNumber: (identificationNumber: string) => api.get(`/kindergarten-account/identification/${identificationNumber}`),
    update: (id: number, data: any) => api.put(`/kindergarten-account/${id}`, data),
    delete: (id: number) => api.delete(`/kindergarten-account/${id}`),
};
