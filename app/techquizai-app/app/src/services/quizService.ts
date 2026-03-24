import { apiClient } from "./apiClient";

export const quizService = {
    generateQuiz: (topic: string) =>
        apiClient.post("/functions/v1/generate-quiz", { topic }),

    getQuiz: (quizId: string) =>
        apiClient.post("/functions/v1/start-quiz", { quizId })
};