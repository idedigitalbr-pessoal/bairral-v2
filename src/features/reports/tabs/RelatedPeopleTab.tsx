import React, { useState } from 'react';
import { Users, UserPlus, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';
import { Report, RelatedPerson } from '../../../types';
import { Badge } from '../../../components/data-display/Badge';
import { Button } from '../../../components/ui/Button';
import { Dialog } from '../../../components/ui/Dialog';
import { useAddRelatedPerson } from '../../../hooks/useReports';

interface RelatedPeopleTabProps {
  report: Report;
  onShowToast: (title: string, message?: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

export function RelatedPeopleTab({ report, onShowToast }: RelatedPeopleTabProps) {
  const addPersonMutation = useAddRelatedPerson();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [involvementType, setInvolvementType] = useState<'DENOUNCED' | 'VICTIM' | 'WITNESS' | 'INVOLVED'>('DENOUNCED');
  const [status, setStatus] = useState<'PENDING_INTERVIEW' | 'INTERVIEWED' | 'DISMISSED'>('PENDING_INTERVIEW');
  const [notes, setNotes] = useState('');

  const peopleList: RelatedPerson[] = report.relatedPeople || [
    {
      id: 'p-1',
      name: 'João Pedro da Silva',
      role: 'Motorista Operacional de Frota Heavy',
      department: 'Operação de Transportes & Frotas',
      involvementType: 'DENOUNCED',
      status: 'PENDING_INTERVIEW',
      notes: 'Citado no relato como responsável direto pela conduta operada.',
    },
    {
      id: 'p-2',
      name: 'Maria Clara Oliveira',
      role: 'Supervisora de SMS & Logística',
      department: 'Gestão de Resíduos, Meio Ambiente & SMS',
      involvementType: 'WITNESS',
      status: 'INTERVIEWED',
      notes: 'Oitiva realizada em 15/01/2026. Prestou esclarecimentos sobre a escala e rota de operação.',
    },
  ];

  const handleAddPerson = async () => {
    if (!name.trim()) {
      onShowToast('Campo obrigatório', 'Informe o nome da pessoa relacionada.', 'warning');
      return;
    }

    await addPersonMutation.mutateAsync({
      id: report.id,
      person: {
        name,
        role: role || undefined,
        department: department || undefined,
        involvementType,
        status,
        notes: notes || undefined,
      },
    });

    onShowToast('Pessoa adicionada', `${name} foi vinculado(a) ao processo com sucesso.`, 'success');
    setIsModalOpen(false);
    setName('');
    setRole('');
    setDepartment('');
    setNotes('');
  };

  const getInvolvementBadge = (type: string) => {
    switch (type) {
      case 'DENOUNCED':
        return <Badge variant="danger">Denunciado(a)</Badge>;
      case 'VICTIM':
        return <Badge variant="warning">Vítima / Afetado(a)</Badge>;
      case 'WITNESS':
        return <Badge variant="info">Testemunha</Badge>;
      default:
        return <Badge variant="secondary">Envolvido(a)</Badge>;
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'INTERVIEWED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" /> Oitiva Realizada
          </span>
        );
      case 'DISMISSED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#737373]">
            <XCircle className="w-3.5 h-3.5 text-[#737373]" /> Dispensado(a)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D97706]">
            <Clock className="w-3.5 h-3.5 text-[#D97706]" /> Pendente de Oitiva
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#171717]" />
            Pessoas Citadas e Envolvidas no Processo
          </h3>
          <p className="text-xs text-[#737373] mt-0.5">
            Mapeamento de denunciados, vítimas, testemunhas e oitivas realizadas.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs gap-1.5 cursor-pointer shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Adicionar Pessoa
        </Button>
      </div>

      {/* People Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E5E5E5] text-[#737373] font-semibold">
                <th className="p-3.5">Nome / Cargo</th>
                <th className="p-3.5">Departamento / Setor</th>
                <th className="p-3.5">Tipo de Envolvimento</th>
                <th className="p-3.5">Status da Oitiva</th>
                <th className="p-3.5">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {peopleList.map((person) => (
                <tr key={person.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="p-3.5 font-medium text-[#0A0A0A]">
                    <div>{person.name}</div>
                    {person.role && <div className="text-[11px] text-[#737373] font-normal">{person.role}</div>}
                  </td>

                  <td className="p-3.5 text-[#525252]">
                    {person.department || '—'}
                  </td>

                  <td className="p-3.5">
                    {getInvolvementBadge(person.involvementType)}
                  </td>

                  <td className="p-3.5">
                    {getStatusBadge(person.status)}
                  </td>

                  <td className="p-3.5 text-[#525252] max-w-xs truncate" title={person.notes}>
                    {person.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Person */}
      {isModalOpen && (
        <Dialog
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title="Vincular Pessoa Relacionada"
          description="Cadastre uma pessoa citada na manifestação para controle de oitiva."
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} disabled={addPersonMutation.isPending}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddPerson}
                isLoading={addPersonMutation.isPending}
              >
                Salvar Vínculo
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Nome Completo <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo Mendes"
                className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Cargo / Função
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Terapêuta Ocupacional"
                  className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Departamento / Setor
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Ex: Ala 3 - Internação"
                  className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Tipo de Envolvimento
                </label>
                <select
                  value={involvementType}
                  onChange={(e) => setInvolvementType(e.target.value as any)}
                  className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                >
                  <option value="DENOUNCED">Denunciado(a)</option>
                  <option value="VICTIM">Vítima / Afetado(a)</option>
                  <option value="WITNESS">Testemunha</option>
                  <option value="INVOLVED">Envolvido(a) Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Status da Oitiva
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                >
                  <option value="PENDING_INTERVIEW">Pendente de Oitiva</option>
                  <option value="INTERVIEWED">Oitiva Realizada</option>
                  <option value="DISMISSED">Dispensado(a)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Observações do Apurador
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detalhes relevantes sobre o depoimento ou conduta..."
                className="w-full bg-white border border-[#D4D4D4] rounded-md p-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
              />
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
