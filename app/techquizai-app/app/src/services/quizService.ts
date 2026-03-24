import { apiClient } from "./apiClient";

export const quizService = {
    generateQuiz: async (topic: string) => {
        const res = await apiClient.post("/generate-quiz", { topic });
        return res.data;
    },

    getQuiz: async (quizId: string) => {
        const res = await apiClient.post("/start-quiz", { quizId });
        return res.data;
    }
};