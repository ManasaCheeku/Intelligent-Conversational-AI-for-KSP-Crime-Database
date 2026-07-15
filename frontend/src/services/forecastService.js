import apiClient from './api';

const forecastService = {
  /**
   * Retrieves spatial predictive risk grids representing estimated criminal density over a given window
   * @param {Object} options
   * @param {string} [options.targetDate] - Target date for the projection (YYYY-MM-DD format)
   * @param {string} [options.crimeType] - Offense category to isolate (e.g., 'larceny', 'vehicle_theft')
   * @param {string} [options.divisionId] - Police division identifier
   */
  getRiskGrid: async (options = {}) => {
    try {
      const params = {};
      if (options.targetDate) params.target_date = options.targetDate;
      if (options.crimeType) params.crime_type = options.crimeType;
      if (options.divisionId) params.division_id = options.divisionId;

      const response = await apiClient.get('/forecast/spatial-grid', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generates a 24-hour localized temporal probability curve for specific offense classes
   * @param {string} divisionId - Target precinct division
   * @param {string} date - Requested prediction date (YYYY-MM-DD)
   */
  getTemporalRiskProfile: async (divisionId, date) => {
    try {
      const response = await apiClient.get('/forecast/temporal-profile', {
        params: {
          division_id: divisionId,
          date: date
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Runs predictive resource allocation algorithms to match personnel to high-risk sectors
   * @param {Object} deploymentParams - Optimization constraints (e.g., available shifts, vehicle count)
   */
  optimizePatrolRoutes: async (deploymentParams = {}) => {
    try {
      const response = await apiClient.post('/forecast/optimize-deployments', deploymentParams);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default forecastService;