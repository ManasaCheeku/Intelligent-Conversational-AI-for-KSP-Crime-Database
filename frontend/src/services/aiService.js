import api from './api';

/**
 * KSP IntelliCrime AI – Datathon 2026
 * AI Service Layer to handle all AI-related features communicating with FastAPI.
 * All functions rely on the shared axios instance ('api') which handles global configs
 * like baseURL, JWT authorization injection, and common error interceptors.
 */

/**
 * Sends a chat message to the AI Assistant.
 * @param {string} message - The user's input prompt.
 * @param {string|null} [conversationId] - Existing conversation ID to maintain state.
 * @returns {Promise<Object>} The AI response object.
 */
export const sendChatMessage = async (message, conversationId = null) => {
  const response = await api.post('/api/v1/ai/chat', {
    message,
    conversation_id: conversationId,
  });
  return response.data;
};

/**
 * Uploads an audio blob (voice command/report) to be transcribed and processed.
 * Uses multipart/form-data.
 * @param {Blob} audioBlob - The recorded voice command audio file.
 * @returns {Promise<Object>} The transcription and process result.
 */
export const uploadVoice = async (audioBlob) => {
  const formData = new FormData();
  // Append the audio file with a standard filename and mime type
  formData.append('file', audioBlob, 'voice_command.wav');

  const response = await api.post('/api/v1/ai/voice', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Translates a given text to the specified language (e.g., Kannada, Hindi).
 * @param {string} text - The text to translate.
 * @param {string} language - Target language code or name.
 * @returns {Promise<Object>} Translation details.
 */
export const translateText = async (text, language) => {
  const response = await api.post('/api/v1/ai/translate', {
    text,
    language,
  });
  return response.data;
};

/**
 * Classifies a crime description into potential sections and categories.
 * @param {string} description - The written description of the incident.
 * @returns {Promise<Object>} Classified IPC/BNS categories and suggestions.
 */
export const classifyCrime = async (description) => {
  const response = await api.post('/api/v1/ai/classify', {
    description,
  });
  return response.data;
};

/**
 * Generates an executive case summary based on Case ID.
 * @param {string|number} caseId - The unique identifier of the case.
 * @returns {Promise<Object>} Summary overview.
 */
export const generateCaseSummary = async (caseId) => {
  const response = await api.get(`/api/v1/ai/case-summary/${caseId}`);
  return response.data;
};

/**
 * Fetches predictive analytics and potential hotspots based on filtering criteria.
 * @param {Object} filters - Search filters (e.g., district, time range, crime type).
 * @returns {Promise<Object>} Crime trend predictions and coordinate list.
 */
export const getCrimePrediction = async (filters) => {
  const response = await api.post('/api/v1/ai/predict', filters);
  return response.data;
};

/**
 * Fetches SHAP/LIME style local explanations for a given ML prediction.
 * @param {string|number} predictionId - The unique prediction result ID.
 * @returns {Promise<Object>} Feature importances and logical rules.
 */
export const getExplainableAI = async (predictionId) => {
  const response = await api.get(`/api/v1/ai/explain/${predictionId}`);
  return response.data;
};

/**
 * Exports a chat conversation as a structured PDF document blob.
 * @param {string} conversationId - The conversation to export.
 * @returns {Promise<Blob>} Binary PDF blob response.
 */
export const exportConversationPDF = async (conversationId) => {
  const response = await api.get(`/api/v1/ai/export/pdf/${conversationId}`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Retrieves the paginated list of chat history for the current logged-in user.
 * @returns {Promise<Array>} List of past conversation references.
 */
export const getConversationHistory = async () => {
  const response = await api.get('/api/v1/ai/history');
  return response.data;
};

/**
 * Clears or soft-deletes an entire conversation thread.
 * @param {string} conversationId - The ID of the conversation to delete.
 * @returns {Promise<Object>} Status confirmation.
 */
export const clearConversation = async (conversationId) => {
  const response = await api.delete(`/api/v1/ai/history/${conversationId}`);
  return response.data;
};

const aiService = {
  sendChatMessage,
  uploadVoice,
  translateText,
  classifyCrime,
  generateCaseSummary,
  getCrimePrediction,
  getExplainableAI,
  exportConversationPDF,
  getConversationHistory,
  clearConversation,
};

export default aiService;