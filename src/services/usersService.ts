import { apiClient } from '../api/client';
import { User, Role } from '../types';
import { AdminPermissionEnum } from '../types/auth';
import { mockUsers, mockRoles } from '../mocks/data';

export interface CreateUserDto {
  name: string;
  email: string;
  roleId: string;
  unitId?: string;
  departmentId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  roleId?: string;
  unitId?: string;
  departmentId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface CreateRoleDto {
  name: string;
  description: string;
  permissions: AdminPermissionEnum[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: AdminPermissionEnum[];
}


export const usersService = {
  getUsers: async (search?: string): Promise<User[]> => {
    try {
      return await apiClient.get<User[]>('/users', { params: { search } });
    } catch (error) {
      let list = [...mockUsers];
      if (search) {
        const s = search.toLowerCase();
        list = list.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
      }
      return list;
    }
  },
  getUserById: async (id: string): Promise<User> => {
    try {
      return await apiClient.get<User>(`/users/${id}`);
    } catch (error) {
      return mockUsers.find((u) => u.id === id) || mockUsers[0];
    }
  },
  createUser: async (data: CreateUserDto): Promise<User> => {
    try {
      return await apiClient.post<User>('/users', data);
    } catch (error) {
      const roleObj = mockRoles.find((r) => r.id === data.roleId);
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        roleId: data.roleId,
        roleName: roleObj?.name || 'Usuário',
        unitId: data.unitId,
        departmentId: data.departmentId,
        status: data.status || 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockUsers.unshift(newUser);
      return newUser;
    }
  },
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    try {
      return await apiClient.put<User>(`/users/${id}`, data);
    } catch (error) {
      const idx = mockUsers.findIndex((u) => u.id === id);
      if (idx !== -1) {
        if (data.roleId) {
          const roleObj = mockRoles.find((r) => r.id === data.roleId);
          if (roleObj) mockUsers[idx].roleName = roleObj.name;
        }
        mockUsers[idx] = { ...mockUsers[idx], ...data };
        return mockUsers[idx];
      }
      return { id, ...data } as User;
    }
  },
  toggleUserStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): Promise<User> => {
    try {
      return await apiClient.patch<User>(`/users/${id}/status`, { status });
    } catch (error) {
      const idx = mockUsers.findIndex((u) => u.id === id);
      if (idx !== -1) {
        mockUsers[idx].status = status;
        return mockUsers[idx];
      }
      return { id, status } as User;
    }
  },
  getRoles: async (): Promise<Role[]> => {
    try {
      return await apiClient.get<Role[]>('/roles');
    } catch (error) {
      return mockRoles;
    }
  },
  createRole: async (data: CreateRoleDto): Promise<Role> => {
    try {
      return await apiClient.post<Role>('/roles', data);
    } catch (error) {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: data.name,
        description: data.description,
        permissions: data.permissions as any,
        isSystemRole: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockRoles.push(newRole);
      return newRole;
    }
  },
  updateRole: async (id: string, data: UpdateRoleDto): Promise<Role> => {
    try {
      return await apiClient.put<Role>(`/roles/${id}`, data);
    } catch (error) {
      const idx = mockRoles.findIndex((r) => r.id === id);
      if (idx !== -1) {
        mockRoles[idx] = { ...mockRoles[idx], ...data } as any;
        return mockRoles[idx];
      }
      return { id, ...data } as Role;
    }
  },

};

