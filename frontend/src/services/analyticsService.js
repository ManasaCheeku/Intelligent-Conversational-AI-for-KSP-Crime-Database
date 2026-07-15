import apiClient from './api';

const analyticsService = {
  /**
   * Retrieves high-level executive statistics and key performance indicators (KPIs)
   * @param {Object} options
   * @param {string} [options.divisionId] - Filter by police division/precinct
   * @param {string} [options.timeframe] - Target window (e.g., '24h', '7d', '30d', 'ytd')
   */
  getExecutiveDashboardStats: async (options = {}) => {
    try {
      const params = {};
      if (options.divisionId) params.division_id = options.divisionId;
      if (options.timeframe) params.timeframe = options.timeframe;

      const response = await apiClient.get('/analytics/dashboard/summary', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generates localized hot-spot metrics and dense coordinate clustering
   * @param {Object} options
   * @param {string} [options.category] - Offense category to isolate
   * @param {string} [options.divisionId] - Filter by precinct
   */
  getHotspotClusters: async (options = {}) => {
    try {
      const params = {};
      if (options.category) params.category = options.category;
      if (options.divisionId) params.division_id = options.divisionId;

      const response = await apiClient.get('/analytics/spatial/hotspots', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtains chronological analytics evaluating trends and year-over-year deltas
   * @param {Object} options
   * @param {string} options.metric - Selected performance index ('clearance_rate', 'response_time', 'incident_volume')
   * @param {string} options.resolution - Chart points grouping ('daily', 'weekly', 'monthly')
   */
  getTrendAnalytics: async (options = {}) => {
    try {
      const response = await apiClient.get('/analytics/temporal/trends', {
        params: {
          metric: options.metric,
          resolution: options.resolution || 'monthly'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default analyticsService;