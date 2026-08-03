import { useState } from 'react';
import { Building2, Plus, Edit2, ChevronRight, MapPin, Users, Check, X, Building } from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/data-display/Badge';
import { FormField, FormLabel } from '../components/forms/FormField';
import { Input } from '../components/forms/Input';
import { PermissionGate } from '../components/auth/PermissionGate';
import { AdminPermissionEnum } from '../types/auth';
import { useUnits } from '../hooks/useUnits';
import { useDepartments } from '../hooks/useDepartments';
import { Unit, Department } from '../types';

export function UnitsPage() {
  // Modais de Unidade
  const [isCreateUnitModalOpen, setIsCreateUnitModalOpen] = useState(false);
  const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Modais de Departamento
  const [isCreateDeptModalOpen, setIsCreateDeptModalOpen] = useState(false);

  // Forms
  const [unitForm, setUnitForm] = useState({
    name: '',
    code: '',
    address: '',
    active: true,
  });

  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    unitId: '',
    active: true,
  });

  // Hooks
  const { units = [], isLoading, createUnit, updateUnit } = useUnits();
  const { departments = [], createDepartment, updateDepartment } = useDepartments();

  // Handlers Unidades
  const handleOpenCreateUnit = () => {
    setUnitForm({ name: '', code: '', address: '', active: true });
    setIsCreateUnitModalOpen(true);
  };

  const handleCreateUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUnit(unitForm);
    setIsCreateUnitModalOpen(false);
  };

  const handleOpenEditUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setUnitForm({
      name: unit.name,
      code: unit.code,
      address: unit.address || '',
      active: unit.active !== undefined ? unit.active : true,
    });
    setIsEditUnitModalOpen(true);
  };

  const handleEditUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;
    await updateUnit({ id: selectedUnit.id, updates: unitForm });
    setIsEditUnitModalOpen(false);
  };

  // Handlers Departamentos
  const handleOpenCreateDept = (unit: Unit) => {
    setSelectedUnit(unit);
    setDeptForm({ name: '', code: '', unitId: unit.id, active: true });
    setIsCreateDeptModalOpen(true);
  };

  const handleCreateDeptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDepartment(deptForm);
    setIsCreateDeptModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-4 gap-4">
        <div>
          <Typography variant="h2">Unidades e Estrutura Organizacional</Typography>
          <p className="text-xs text-[#737373]">
            Mapeamento hierárquico das bases operacionais, escritórios e divisões de serviços do Grupo Bairral
          </p>
        </div>
        <PermissionGate permission={AdminPermissionEnum.MANAGE_UNITS}>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreateUnit}>
            Nova Unidade
          </Button>
        </PermissionGate>
      </div>

      {/* Lista Hierárquica */}
      {isLoading ? (
        <Surface variant="card" className="p-8 text-center text-xs text-[#737373]">
          Carregando estrutura organizacional...
        </Surface>
      ) : (
        <div className="space-y-4">
          {units.map((unit) => {
            const unitDepts = departments.filter((d) => d.unitId === unit.id);

            return (
              <Surface key={unit.id} variant="card" className="space-y-4 border border-[#E5E5E5]">
                {/* Cabeçalho da Unidade */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F5] pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded bg-[#EFF6FF] text-[#004B87] flex items-center justify-center font-bold font-mono text-xs shrink-0 border border-[#DBEAFE]">
                      {unit.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">{unit.name}</h3>
                        <Badge variant={unit.active ? 'success' : 'secondary'} size="sm">
                          {unit.active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                      <span className="text-xs text-[#737373] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {unit.address || 'Barcarena / PA'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <PermissionGate permission={AdminPermissionEnum.MANAGE_UNITS}>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenCreateDept(unit)}
                      >
                        Adicionar Departamento
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenEditUnit(unit)}
                      >
                        Editar Unidade
                      </Button>
                    </PermissionGate>
                  </div>
                </div>

                {/* Sub-lista de Departamentos */}
                <div className="space-y-2 pl-2 sm:pl-4 border-l-2 border-[#E5E5E5]">
                  <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider block mb-1">
                    Departamentos / Pavilhões ({unitDepts.length})
                  </span>

                  {unitDepts.length === 0 ? (
                    <p className="text-xs text-[#A3A3A3] italic">Nenhum departamento cadastrado para esta unidade.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {unitDepts.map((dept) => (
                        <div
                          key={dept.id}
                          className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA] border border-[#E5E5E5] text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Building className="w-3.5 h-3.5 text-[#004B87]" />
                            <div>
                              <span className="font-semibold text-[#171717] block">{dept.name}</span>
                              <span className="text-[10px] text-[#737373] font-mono">Cód: {dept.code}</span>
                            </div>
                          </div>
                          <Badge variant={dept.active ? 'success' : 'secondary'} size="sm">
                            {dept.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Surface>
            );
          })}
        </div>
      )}

      {/* Modal: Criar Unidade */}
      {isCreateUnitModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Surface variant="card" className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">Cadastrar Nova Unidade</h3>
              <button
                onClick={() => setIsCreateUnitModalOpen(false)}
                className="text-[#737373] hover:text-[#0A0A0A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUnitSubmit} className="space-y-4 text-xs">
              <FormField>
                <FormLabel>Nome da Unidade</FormLabel>
                <Input
                  required
                  placeholder="Ex: Pavilhão Central"
                  value={unitForm.name}
                  onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel>Código Identificador (Sigla)</FormLabel>
                <Input
                  required
                  placeholder="Ex: ITV-PC"
                  value={unitForm.code}
                  onChange={(e) => setUnitForm({ ...unitForm, code: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel>Endereço / Localização Física</FormLabel>
                <Input
                  placeholder="Ex: Bairro Burajuba, Barcarena/PA"
                  value={unitForm.address}
                  onChange={(e) => setUnitForm({ ...unitForm, address: e.target.value })}
                />
              </FormField>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateUnitModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Salvar Unidade
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      )}

      {/* Modal: Criar Departamento */}
      {isCreateDeptModalOpen && selectedUnit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Surface variant="card" className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">
                Novo Departamento em "{selectedUnit.name}"
              </h3>
              <button
                onClick={() => setIsCreateDeptModalOpen(false)}
                className="text-[#737373] hover:text-[#0A0A0A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeptSubmit} className="space-y-4 text-xs">
              <FormField>
                <FormLabel>Nome do Departamento / Setor</FormLabel>
                <Input
                  required
                  placeholder="Ex: Enfermagem Noturna"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel>Código Interno</FormLabel>
                <Input
                  required
                  placeholder="Ex: ENF-N"
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                />
              </FormField>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateDeptModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Cadastrar Departamento
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      )}
    </div>
  );
}
