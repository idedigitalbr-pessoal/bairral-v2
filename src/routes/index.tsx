import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Guardas de Rota
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { GuestRoute } from '../components/auth/GuestRoute';
import { AdminPermissionEnum } from '../types/auth';

// Páginas Públicas
import { PublicPage } from '../pages/PublicPage';
import { RegisterReportPage } from '../pages/RegisterReportPage';
import { TrackReportPage } from '../pages/TrackReportPage';
import { FaqPage } from '../pages/FaqPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';
import { AnonymityPage } from '../pages/AnonymityPage';

// Páginas de Autenticação & Conta (FASE 10)
import { LoginPage } from '../pages/LoginPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { FirstAccessPage } from '../pages/FirstAccessPage';
import { ChangePasswordPage } from '../pages/ChangePasswordPage';
import { SessionExpiredPage } from '../pages/SessionExpiredPage';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';

// Páginas Administrativas
import { AdminPage } from '../pages/AdminPage';
import { AdminReportsPage } from '../pages/AdminReportsPage';
import { AdminReportDetailsPage } from '../pages/AdminReportDetailsPage';
import { ActionPlansPage } from '../pages/ActionPlansPage';
import { ReportsAnalyticsPage } from '../pages/ReportsAnalyticsPage';
import { UsersPage } from '../pages/UsersPage';
import { RolesPage } from '../pages/RolesPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { UnitsPage } from '../pages/UnitsPage';
import { AuditPage } from '../pages/AuditPage';
import { SettingsPage } from '../pages/SettingsPage';

// Outras Páginas
import { DesignSystemPage } from '../pages/DesignSystemPage';
import { MaintenancePage } from '../pages/MaintenancePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ScrollToTop } from '../components/utils/ScrollToTop';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Rotas Públicas encapsuladas pelo PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicPage />} />
          <Route path="/registrar" element={<RegisterReportPage />} />
          <Route path="/acompanhar" element={<TrackReportPage />} />
          <Route path="/perguntas-frequentes" element={<FaqPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/termos" element={<TermsPage />} />
          <Route path="/anonimato" element={<AnonymityPage />} />
        </Route>

        {/* Indisponibilidade & Erros de Sistema */}
        <Route path="/indisponivel" element={<MaintenancePage />} />
        <Route path="/sessao-expirada" element={<SessionExpiredPage />} />
        <Route path="/acesso-negado" element={<AccessDeniedPage />} />

        {/* Rotas de Visitante / Autenticação (GuestRoute - redireciona se já logado) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
          <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
        </Route>

        {/* Rota Especial: Troca Obrigatória de Senha no Primeiro Acesso */}
        <Route
          path="/primeiro-acesso"
          element={
            <ProtectedRoute>
              <FirstAccessPage />
            </ProtectedRoute>
          }
        />

        {/* Rota Protegida: Alteração de Senha do Usuário */}
        <Route
          path="/alterar-senha"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        {/* Rotas Administrativas Protegidas encapsuladas pelo AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPage />} />
          <Route path="manifestacoes" element={<AdminReportsPage />} />
          <Route path="manifestacoes/:id" element={<AdminReportDetailsPage />} />
          <Route path="planos-de-acao" element={<ActionPlansPage />} />
          <Route path="relatorios" element={<ReportsAnalyticsPage />} />

          {/* Rotas com Permissões Específicas */}
          <Route
            path="usuarios"
            element={
              <ProtectedRoute requiredPermission={AdminPermissionEnum.MANAGE_USERS}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="perfis"
            element={
              <ProtectedRoute requiredPermission={AdminPermissionEnum.MANAGE_USERS}>
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="unidades" element={<UnitsPage />} />
          <Route
            path="auditoria"
            element={
              <ProtectedRoute requiredPermission={AdminPermissionEnum.ACCESS_AUDIT}>
                <AuditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="configuracoes"
            element={
              <ProtectedRoute requiredPermission={AdminPermissionEnum.MANAGE_SETTINGS}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Guia de Estilo / Design System */}
        <Route path="/design-system" element={<DesignSystemPage />} />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
