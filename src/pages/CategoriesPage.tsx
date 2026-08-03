import { useState } from 'react';
import { Layers, Plus, Edit2, Search, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/data-display/Badge';
import { FormField, FormLabel } from '../components/forms/FormField';
import { Input } from '../components/forms/Input';
import { PermissionGate } from '../components/auth/PermissionGate';
import { AdminPermissionEnum } from '../types/auth';
import { useCategories } from '../hooks/useCategories';
import { Category, RiskLevelEnum } from '../types';

export function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [form, setForm] = useState({
    name: '',
    code: 'CAT',
    description: '',
    slaDays: 7,
    defaultRiskLevel: RiskLevelEnum.MEDIUM as RiskLevelEnum,
    active: true,
  });

  const {
    categories = [],
    isLoading,
    createCategory,
    updateCategory,
    toggleCategoryActive,
  } = useCategories();

  const handleOpenCreate = () => {
    setForm({
      name: '',
      code: 'CAT',
      description: '',
      slaDays: 7,
      defaultRiskLevel: RiskLevelEnum.MEDIUM,
      active: true,
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory(form);
    setIsCreateModalOpen(false);
  };

  const handleOpenEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setForm({
      name: cat.name,
      code: cat.code || 'CAT',
      description: cat.description,
      slaDays: cat.slaDays,
      defaultRiskLevel: cat.defaultRiskLevel || RiskLevelEnum.MEDIUM,
      active: cat.active !== undefined ? cat.active : true,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    await updateCategory({
      id: selectedCategory.id,
      updates: form,
    });
    setIsEditModalOpen(false);
  };

  const handleToggleActive = async (cat: Category) => {
    const nextState = !cat.active;
    await toggleCategoryActive({ id: cat.id, active: nextState });
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-4 gap-4">
        <div>
          <Typography variant="h2">Categorias de Manifestação</Typography>
          <p className="text-xs text-[#737373]">
            Classificação temáticas de relatos, SLAs padrão de atendimento e sugestão de matiz de risco
          </p>
        </div>
        <PermissionGate permission={AdminPermissionEnum.MANAGE_CATEGORIES}>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
            Nova Categoria
          </Button>
        </PermissionGate>
      </div>

      {/* Busca */}
      <Surface variant="card" className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#737373]" />
          <input
            type="text"
            placeholder="Buscar categoria por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
          />
        </div>
        <span className="text-xs text-[#737373]">{filteredCategories.length} categorias encontradas</span>
      </Surface>

      {/* Grid de Categorias */}
      {isLoading ? (
        <Surface variant="card" className="p-8 text-center text-xs text-[#737373]">
          Carregando categorias...
        </Surface>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <Surface
              key={cat.id}
              variant="card"
              className={`space-y-3 flex flex-col justify-between border ${
                cat.active ? 'border-[#E5E5E5]' : 'border-[#E5E5E5] opacity-60 bg-[#FAFAFA]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-heading font-bold text-sm text-[#0A0A0A]">{cat.name}</h4>
                  <Badge variant={cat.active ? 'success' : 'secondary'} size="sm">
                    {cat.active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
                <p className="text-xs text-[#525252] line-clamp-2">{cat.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#F5F5F5] p-2.5 rounded">
                <div className="flex items-center gap-1.5 text-[#004B87] font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>SLA: {cat.slaDays} dias</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#525252]">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#E65100]" />
                  <span>Risco: {cat.defaultRiskLevel || RiskLevelEnum.MEDIUM}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F5F5F5] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#737373]">{cat.reportCount || 0} manifestações vinculadas</span>
                <div className="flex items-center gap-1">
                  <PermissionGate permission={AdminPermissionEnum.MANAGE_CATEGORIES}>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenEdit(cat)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cat.active ? 'text-[#A80000]' : 'text-[#107C41]'}
                      onClick={() => handleToggleActive(cat)}
                    >
                      {cat.active ? 'Desativar' : 'Ativar'}
                    </Button>
                  </PermissionGate>
                </div>
              </div>
            </Surface>
          ))}
        </div>
      )}

      {/* Modal: Criar / Editar Categoria */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Surface variant="card" className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">
                {isCreateModalOpen ? 'Nova Categoria' : `Editar Categoria: ${selectedCategory?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-[#737373] hover:text-[#0A0A0A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={isCreateModalOpen ? handleCreateSubmit : handleEditSubmit}
              className="space-y-4 text-xs"
            >
              <FormField>
                <FormLabel>Nome da Categoria</FormLabel>
                <Input
                  required
                  placeholder="Ex: Assédio Moral ou Sexual"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel>Descrição e Enquadramento</FormLabel>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva o tipo de manifestação que se enquadra nesta categoria..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField>
                  <FormLabel>SLA Padrão (Dias Úteis)</FormLabel>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={form.slaDays}
                    onChange={(e) => setForm({ ...form, slaDays: Number(e.target.value) })}
                  />
                </FormField>

                <FormField>
                  <FormLabel>Risco Sugerido</FormLabel>
                  <select
                    value={form.defaultRiskLevel}
                    onChange={(e) => setForm({ ...form, defaultRiskLevel: e.target.value as any })}
                    className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                  >
                    <option value={RiskLevelEnum.LOW}>Baixo</option>
                    <option value={RiskLevelEnum.MEDIUM}>Médio</option>
                    <option value={RiskLevelEnum.HIGH}>Alto</option>
                    <option value={RiskLevelEnum.CRITICAL}>Crítico</option>
                  </select>
                </FormField>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Salvar Categoria
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      )}
    </div>
  );
}
