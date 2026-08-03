import { apiClient } from '../api/client';
import { Unit, Department } from '../types';
import { mockUnits, mockDepartments } from '../mocks/data';

export const unitsService = {
  getUnits: async (): Promise<Unit[]> => {
    try {
      return await apiClient.get<Unit[]>('/units');
    } catch (error) {
      console.warn('Usando unidades mockadas devido a erro de rede:', error);
      return mockUnits;
    }
  },
  createUnit: async (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unit> => {
    try {
      return await apiClient.post<Unit>('/units', unit);
    } catch (error) {
      console.warn('Criando unidade mockada:', error);
      const newUnit: Unit = {
        id: `unit-${Date.now()}`,
        ...unit,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockUnits.push(newUnit);
      return newUnit;
    }
  },
  updateUnit: async (id: string, updates: Partial<Unit>): Promise<Unit> => {
    try {
      return await apiClient.put<Unit>(`/units/${id}`, updates);
    } catch (error) {
      console.warn('Atualizando unidade mockada:', error);
      const idx = mockUnits.findIndex((u) => u.id === id);
      if (idx !== -1) {
        mockUnits[idx] = { ...mockUnits[idx], ...updates, updatedAt: new Date().toISOString() };
        return mockUnits[idx];
      }
      return { id, ...updates } as Unit;
    }
  },
  deleteUnit: async (id: string): Promise<{ id: string }> => {
    try {
      return await apiClient.delete<{ id: string }>(`/units/${id}`);
    } catch (error) {
      console.warn('Deletando unidade mockada:', error);
      const idx = mockUnits.findIndex((u) => u.id === id);
      if (idx !== -1) {
        mockUnits.splice(idx, 1);
      }
      return { id };
    }
  },
  getDepartments: async (unitId?: string): Promise<Department[]> => {
    try {
      return await apiClient.get<Department[]>('/departments', { params: { unitId } });
    } catch (error) {
      console.warn('Usando departamentos mockados devido a erro de rede:', error);
      if (unitId) {
        return mockDepartments.filter((d) => d.unitId === unitId);
      }
      return mockDepartments;
    }
  },
  createDepartment: async (dept: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
    try {
      return await apiClient.post<Department>('/departments', dept);
    } catch (error) {
      console.warn('Criando departamento mockado:', error);
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        ...dept,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDepartments.push(newDept);
      return newDept;
    }
  },
  updateDepartment: async (id: string, updates: Partial<Department>): Promise<Department> => {
    try {
      return await apiClient.put<Department>(`/departments/${id}`, updates);
    } catch (error) {
      console.warn('Atualizando departamento mockado:', error);
      const idx = mockDepartments.findIndex((d) => d.id === id);
      if (idx !== -1) {
        mockDepartments[idx] = { ...mockDepartments[idx], ...updates, updatedAt: new Date().toISOString() };
        return mockDepartments[idx];
      }
      return { id, ...updates } as Department;
    }
  },
  deleteDepartment: async (id: string): Promise<{ id: string }> => {
    try {
      return await apiClient.delete<{ id: string }>(`/departments/${id}`);
    } catch (error) {
      console.warn('Deletando departamento mockado:', error);
      const idx = mockDepartments.findIndex((d) => d.id === id);
      if (idx !== -1) {
        mockDepartments.splice(idx, 1);
      }
      return { id };
    }
  },
};

