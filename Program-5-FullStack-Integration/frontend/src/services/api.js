/**
 * API Service Client
 * Handles HTTP requests to the Express.js / Sequelize backend
 * Configured using environment variables (VITE_API_URL)
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // GET /api/attendance
  async getAllAttendance(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const url = `${BASE_URL}/attendance${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch records: ${response.statusText}`);
    }
    return response.json();
  },

  // GET /api/attendance/stats
  async getStats() {
    const response = await fetch(`${BASE_URL}/attendance/stats`);
    if (!response.ok) throw new Error('Failed to load stats');
    return response.json();
  },

  // GET /api/attendance/:id
  async getById(id) {
    const response = await fetch(`${BASE_URL}/attendance/${id}`);
    if (!response.ok) throw new Error(`Record ${id} not found`);
    return response.json();
  },

  // POST /api/attendance
  async createAttendance(recordData) {
    const response = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(recordData)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to create attendance record');
    }
    return response.json();
  },

  // PUT /api/attendance/:id
  async updateAttendance(id, updateData) {
    const response = await fetch(`${BASE_URL}/attendance/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to update record');
    }
    return response.json();
  },

  // DELETE /api/attendance/:id
  async deleteAttendance(id) {
    const response = await fetch(`${BASE_URL}/attendance/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete record');
    return response.json();
  }
};
