import apiClient from './api';

const reportService = {
  /**
   * Retrieves a history of generated intelligence briefs and tactical audit logs
   * @param {Object} [filters] - Optional filter options
   * @param {string} [filters.status] - Filter by status ('completed', 'pending', 'failed')
   * @param {string} [filters.type] - Filter by report classification ('case_summary', 'tactical_dispatch', 'spatial_density')
   */
  getReportsList: async (filters = {}) => {
    try {
      const response = await apiClient.get('/reports', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Dispatches an asynchronous worker pipeline on the server to build a custom PDF/XLSX report
   * @param {Object} reportConfig - Layout, target sections, and filtering boundaries
   * @param {string} reportConfig.title - Custom title for the report
   * @param {string} reportConfig.type - Report type ('spatial_density', 'case_summary', etc.)
   * @param {Object} reportConfig.parameters - Query parameters to compile (e.g., date ranges, sector IDs)
   */
  generateReport: async (reportConfig) => {
    try {
      const response = await apiClient.post('/reports/generate', reportConfig);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Downloads compiled report artifacts directly as a binary blob stream
   * @param {string} reportId - Target report database identifier
   * @param {string} fileExtension - Expected extension, defaults to 'pdf'
   */
  downloadReportBlob: async (reportId, fileExtension = 'pdf') => {
    try {
      // Axios request overrides default responseType to capture structural binary streams
      const response = await apiClient.get(`/reports/${reportId}/download`, {
        responseType: 'blob'
      });

      // Create local file pointer and trigger browser file-save prompt safely
      const blob = new Blob([response.data], { 
        type: fileExtension === 'xlsx' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          : 'application/pdf' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `KSP_IntelliCrime_Report_${reportId}.${fileExtension}`);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup DOM footprint and revoke performance link pointers
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Sets up automated recursive schedules for localized report dispatches
   * @param {Object} scheduleConfig 
   */
  scheduleReport: async (scheduleConfig) => {
    try {
      const response = await apiClient.post('/reports/schedules', scheduleConfig);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deletes a registered report meta-record or cached asset from disk space
   * @param {string} reportId 
   */
  deleteReport: async (reportId) => {
    try {
      const response = await apiClient.delete(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reportService;