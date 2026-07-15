import apiClient from './api';

const networkService = {
  /**
   * Generates graph structural data (nodes and edges) for association networks
   * @param {Object} options
   * @param {string} [options.seedEntityId] - Root entity ID (suspect, vehicle, or phone) to build the graph around
   * @param {number} [options.depth] - Degrees of separation (default is 2)
   * @param {Array<string>} [options.relationshipTypes] - Filter list (e.g., 'financial', 'communication', 'familial')
   */
  getAssociationGraph: async (options = {}) => {
    try {
      const params = {};
      if (options.seedEntityId) params.seed_entity_id = options.seedEntityId;
      if (options.depth) params.depth = options.depth;
      if (options.relationshipTypes) params.relationship_types = options.relationshipTypes.join(',');

      const response = await apiClient.get('/network/graph', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Evaluates key communication vectors, call detail records (CDRs), or transaction flows
   * @param {string} entityAId - Origin entity identifier
   * @param {string} entityBId - Target entity identifier
   */
  getLinkDetails: async (entityAId, entityBId) => {
    try {
      const response = await apiClient.get('/network/link-details', {
        params: {
          entity_a_id: entityAId,
          entity_b_id: entityBId
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Runs centrality and pathway analysis to identify structural bottlenecks or syndicate leaders
   * @param {string} graphId - Current workspace graph partition ID
   */
  getNetworkMetrics: async (graphId) => {
    try {
      const response = await apiClient.get(`/network/graphs/${graphId}/metrics`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default networkService;