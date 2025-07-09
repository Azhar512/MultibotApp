// src/services/api.js
export const dashboardAPI = {
  getStats: async () => {
    // Mock data for now
    return {
      success: true,
      data: {
        totalInteractions: 1250,
        successRate: 94.5,
        activeUsers: 342,
        averageResponseTime: 1200,
        previousPeriod: {
          totalInteractions: 1100,
          successRate: 92.1,
          activeUsers: 310,
          averageResponseTime: 1400
        },
        interactionsByType: {
          chat: 45,
          email: 25,
          voice: 20,
          appointment: 10
        }
      }
    };
  },
  
  getInteractionTrends: async () => {
    return {
      success: true,
      data: [
        { date: '2024-01-01', interactions: 120 },
        { date: '2024-01-02', interactions: 150 },
        { date: '2024-01-03', interactions: 180 }
      ]
    };
  },
  
  getPersonalityEffectiveness: async () => {
    return {
      success: true,
      data: {
        friendly: 85,
        professional: 92,
        helpful: 88
      }
    };
  }
};