import api from './api';

export const routineService = {
  getRoutinesByStudent: async (studentId) => {
    const response = await api.get(`/routines/student/${studentId}`);
    return response.data;
  },

  getRoutinesByDate: async (date) => {
    const response = await api.get(`/routines/date/${date}`);
    return response.data;
  },

  saveRoutine: async (routineData) => {
    const response = await api.post('/routines', routineData);
    return response.data;
  },

  deleteRoutine: async (id) => {
    const response = await api.delete(`/routines/${id}`);
    return response.data;
  },

  addFeedback: async (id, feedback) => {
    const response = await api.put(`/routines/${id}/feedback`, { feedback });
    return response.data;
  }
};