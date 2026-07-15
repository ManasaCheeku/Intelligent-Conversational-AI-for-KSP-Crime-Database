import apiClient from './api';

const crimeService = {
  /**
   * Fetches incident records with support for dynamic geofencing, temporal, and category filtering
   * @param {Object} filters - Search parameters
   * @param {string} [filters.category] - Offense category (e.g., 'burglary', 'assault')
   * @param {string} [filters.startDate] - ISO 8601 boundary start
   * @param {string} [filters.endDate] - ISO 8601 boundary end
   * @param {Array<number>} [filters.bbox] - Spatial bounding box coordinate limits [minLng, minLat, maxLng, maxLat]
   * @param {number} [filters.limit] - Page limit parameters (defaults to 50)
   * @param {number} [filters.offset] - Page pagination parameters
   */
  getIncidents: async (filters = {}) => {
    try {
      const params = {};
      
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;
      if (filters.bbox) params.bbox = filters.bbox.join(',');
      if (filters.limit) params.limit = filters.limit;
      if (filters.offset) params.offset = filters.offset;

      const response = await apiClient.get('/crimes/incidents', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieves specific structural attributes of an incident by its system identifier
   * @param {string} incidentId 
   */
  getIncidentById: async (incidentId) => {
    try {
      const response = await apiClient.get(`/crimes/incidents/${incidentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Registers a new incident log with tactical coordinates and witness accounts
   * @param {Object} incidentData 
   */
  createIncident: async (incidentData) => {
    try {
      const response = await apiClient.post('/crimes/incidents', incidentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Modifies an ongoing incident record with secondary evidence markers or risk parameters
   * @param {string} incidentId 
   * @param {Object} patchData 
   */
  updateIncident: async (incidentId, patchData) => {
    try {
      const response = await apiClient.patch(`/crimes/incidents/${incidentId}`, patchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Performs high-dimensional queries over active suspect profiles and cross-agency aliases
   * @param {Object} filters 
   */
  getSuspects: async (filters = {}) => {
    try {
      const response = await apiClient.get('/crimes/suspects', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetches detailed suspect file and lineage relationships
   * @param {string} suspectId 
   */
  getSuspectById: async (suspectId) => {
    try {
      const response = await apiClient.get(`/crimes/suspects/${suspectId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default crimeService;