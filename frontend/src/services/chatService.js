import apiClient from './api';

const chatService = {
  /**
   * Retrieves all active conversational investigation sessions for the logged-in officer
   * @returns {Promise<Array>} List of chat sessions
   */
  getSessions: async () => {
    try {
      const response = await apiClient.get('/chat/sessions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Spawns a new analytical session focused on a specific case or regional jurisdiction
   * @param {string} title - Optional title describing the analytical line of inquiry
   * @param {string} [caseId] - Optional associated system case record ID
   */
  createSession: async (title, caseId = null) => {
    try {
      const response = await apiClient.post('/chat/sessions', {
        title,
        case_id: caseId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieves full historical message blocks for a specific interactive session
   * @param {string} sessionId 
   */
  getSessionMessages: async (sessionId) => {
    try {
      const response = await apiClient.get(`/chat/sessions/${sessionId}/messages`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Transmits an analytical query to the core LLM reasoning engine
   * @param {string} sessionId - Target interactive session ID
   * @param {string} message - Plain text context/query from the user
   * @param {Object} [parameters] - Optional filters (e.g., coordinates, sector constraints)
   */
  sendMessage: async (sessionId, message, parameters = {}) => {
    try {
      const response = await apiClient.post(`/chat/sessions/${sessionId}/messages`, {
        message,
        parameters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Permanently purges an interactive thread from session indexes
   * @param {string} sessionId 
   */
  deleteSession: async (sessionId) => {
    try {
      const response = await apiClient.delete(`/chat/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default chatService;