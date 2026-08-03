import { apiClient } from '../api/client';
import { mockSettings } from '../mocks/data';

export interface SystemSettings {
  institutional: {
    organizationName: string;
    cnpj: string;
    address: string;
    ethicsEmail: string;
    dpoName: string;
    dpoEmail: string;
  };
  slaDefaults: {
    criticalTriageDays: number;
    normalTriageDays: number;
    finalResolutionDays: number;
    maxExtensionDays: number;
  };
  policies: {
    privacyTerms: string;
    antiRetaliationPolicy: string;
    anonymityGuidelines: string;
  };
  messageTemplates: {
    receiptConfirmation: string;
    infoRequest: string;
    extensionNotice: string;
    closureNotice: string;
  };
  retention: {
    retentionYears: number;
    autoPurgeSensitiveEvidence: boolean;
  };
  alternativeChannels: {
    phone0800: string;
    whatsappNumber: string;
    physicalBoxLocations: string;
  };
  notifications: {
    notifyCriticalCasesImmediately: boolean;
    notifySlaWarning24h: boolean;
    weeklyCommitteeDigest: boolean;
  };
}

let localSettings = { ...mockSettings };

export const settingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    try {
      return await apiClient.get<SystemSettings>('/settings');
    } catch (error) {
      console.warn('Usando configurações mockadas devido a erro de rede:', error);
      return localSettings;
    }
  },
  updateSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    try {
      return await apiClient.put<SystemSettings>('/settings', settings);
    } catch (error) {
      console.warn('Atualizando configurações mockadas localmente:', error);
      localSettings = {
        ...localSettings,
        ...settings,
        institutional: { ...localSettings.institutional, ...(settings.institutional || {}) },
        slaDefaults: { ...localSettings.slaDefaults, ...(settings.slaDefaults || {}) },
        policies: { ...localSettings.policies, ...(settings.policies || {}) },
        messageTemplates: { ...localSettings.messageTemplates, ...(settings.messageTemplates || {}) },
        retention: { ...localSettings.retention, ...(settings.retention || {}) },
        alternativeChannels: { ...localSettings.alternativeChannels, ...(settings.alternativeChannels || {}) },
        notifications: { ...localSettings.notifications, ...(settings.notifications || {}) },
      };
      return localSettings;
    }
  },
};

