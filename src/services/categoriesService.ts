import { apiClient } from '../api/client';
import { Category } from '../types';
import { mockCategories } from '../mocks/data';

export const categoriesService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      return await apiClient.get<Category[]>('/categories');
    } catch (error) {
      console.warn('Usando categorias mockadas devido a erro de rede:', error);
      return mockCategories;
    }
  },
  createCategory: async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'reportCount'>): Promise<Category> => {
    try {
      return await apiClient.post<Category>('/categories', category);
    } catch (error) {
      console.warn('Criando categoria mockada:', error);
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        ...category,
        reportCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockCategories.push(newCat);
      return newCat;
    }
  },
  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category> => {
    try {
      return await apiClient.put<Category>(`/categories/${id}`, updates);
    } catch (error) {
      console.warn('Atualizando categoria mockada:', error);
      const idx = mockCategories.findIndex((c) => c.id === id);
      if (idx !== -1) {
        mockCategories[idx] = { ...mockCategories[idx], ...updates, updatedAt: new Date().toISOString() };
        return mockCategories[idx];
      }
      return { id, ...updates } as Category;
    }
  },
  toggleCategoryActive: async (id: string, active: boolean): Promise<Category> => {
    try {
      return await apiClient.patch<Category>(`/categories/${id}/active`, { active });
    } catch (error) {
      console.warn('Alternando ativo na categoria mockada:', error);
      const idx = mockCategories.findIndex((c) => c.id === id);
      if (idx !== -1) {
        mockCategories[idx].active = active;
        mockCategories[idx].updatedAt = new Date().toISOString();
        return mockCategories[idx];
      }
      return { id, active } as Category;
    }
  },
  deleteCategory: async (id: string): Promise<{ id: string }> => {
    try {
      return await apiClient.delete<{ id: string }>(`/categories/${id}`);
    } catch (error) {
      console.warn('Removendo categoria mockada:', error);
      const idx = mockCategories.findIndex((c) => c.id === id);
      if (idx !== -1) {
        mockCategories.splice(idx, 1);
      }
      return { id };
    }
  },
};

