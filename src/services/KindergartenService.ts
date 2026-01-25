import api from "./api";

export const KindergartenService = {
    create: (data: any) => api.post("/kindergarten", data),
    getAll: (page = 0, size = 10) => api.get(`/kindergarten?page=${page}&size=${size}`),
    getById: (id: number) => api.get(`/kindergarten/${id}`),
    update: (id: number, data: any) => api.put(`/kindergarten/${id}`, data),
    delete: (id: number) => api.delete(`/kindergarten/${id}`),
};
