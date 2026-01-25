import api from "./api";

export const ActivityService = {
    create: (data: any) => api.post("/activities", data),
    getAll: (page = 0, size = 10) => api.get(`/activities?page=${page}&size=${size}`),
    getById: (id: number) => api.get(`/activities/${id}`),
    getByName: (name: string) => api.get(`/activities/name/${name}`),
    update: (id: number, data: any) => api.put(`/activities/${id}`, data),
    delete: (id: number) => api.delete(`/activities/${id}`),
};
