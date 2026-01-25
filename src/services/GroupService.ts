import api from "./api";

export const GroupService = {
    create: (data: any) => api.post("/groups", data),
    getAll: (page = 0, size = 10) => api.get(`/groups?page=${page}&size=${size}`),
    getById: (id: number) => api.get(`/groups/${id}`),
    getByName: (name: string) => api.get(`/groups/name/${name}`),
    update: (id: number, data: any) => api.put(`/groups/${id}`, data),
    delete: (id: number) => api.delete(`/groups/${id}`),
};
