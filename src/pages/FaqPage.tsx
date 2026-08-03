import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ShieldCheck, FilePlus, Search, Lock, Clock, FileText, AlertCircle } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Accordion } from '../components/ui/Accordion';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { Badge } from '../components/data-display/Badge';

export function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todas as Dúvidas' },
    { id: 'anonimato', label: 'Anonimato & Segurança' },
    { id: 'prazos', label: 'Prazos & Procedimentos' },
    { id: 'anexos', label: 'Anexos & Evidências' },
    { id: 'retaliacao', label: 'Proteção & Não Retaliação' },
  ];

  const allFaqs = [
    {
      id: 'faq1',
      category: 'anonimato',
      title: 'O que é o Canal de Ética e Integridade do Grupo Bairral?',
      content:
        'É uma ferramenta institucional independente criada para que colaboradores, pacientes, familiares, acompanhantes e fornecedores possam registrar denúncias, elogios, sugestões, reclamações ou dúvidas sobre condutas e normas éticas relativas ao Grupo Bairral.',
    },
    {
      id: 'faq2',
      category: 'anonimato',
      title: 'Meu anonimato é realmente garantido?',
      content:
        'Sim, 100%. Ao selecionar o relato anônimo, nosso sistema desvincula qualquer endereço IP, dados do navegador ou geolocalização. A comunicação é realizada unicamente por meio de um protocolo aleatório e uma chave de segurança privada.',
    },
    {
      id: 'faq3',
      category: 'prazos',
      title: 'Quanto tempo leva para receber uma resposta?',
      content:
        'A triagem e classificação inicial pela Comissão de Ética ocorrem em até 48 horas úteis. O prazo máximo para envio do parecer conclusivo ou atualização de plano de ação varia entre 7 e 15 dias úteis, conforme a complexidade do caso.',
    },
    {
      id: 'faq4',
      category: 'anexos',
      title: 'Posso anexar fotos, áudios ou documentos como evidência?',
      content:
        'Sim. É possível anexar arquivos nos formatos PDF, PNG, JPG ou TXT. Antes de enviar, certifique-se de remover metadados de imagens ou identificações pessoais dos arquivos caso deseje manter o anonimato.',
    },
    {
      id: 'faq5',
      category: 'prazos',
      title: 'O que acontece se eu perder meu número de protocolo ou chave de acesso?',
      content:
        'Por razões estritas de segurança da informação e sigilo, o sistema não armazena vínculos entre o relator e as chaves de acesso anônimas. Em caso de perda, será necessário registrar uma nova manifestação.',
    },
    {
      id: 'faq6',
      category: 'retaliacao',
      title: 'Existe perigo de retaliação ao fazer um relato identificado ou anônimo?',
      content:
        'Não. O Grupo Bairral estabelece em seu Código de Ética a política de Tolerância Zero contra qualquer conduta de retaliação ou perseguição contra relatores de boa-fé. Violações dessa garantia acarretam sanções disciplinares severas.',
    },
    {
      id: 'faq7',
      category: 'anonimato',
      title: 'Quem tem acesso às informações enviadas pelo portal?',
      content:
        'O acesso às manifestações é estritamente restrito aos membros autorizados da Comissão de Ética e Ouvidoria do Grupo Bairral. Nenhum gestor direto ou departamento citado possui acesso prévio ao relato.',
    },
    {
      id: 'faq8',
      category: 'anexos',
      title: 'Existe limite de tamanho para envio de arquivos anexos?',
      content:
        'O limite por arquivo anexo é de até 10 MB. Caso você possua volume superior de documentos, mencione essa necessidade no relato para que a equipe instrua o recebimento seguro.',
    },
  ];

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const accordionItems = filteredFaqs.map((faq) => ({
    id: faq.id,
    title: (
      <div className="flex items-center gap-2">
        <span className="font-heading font-semibold text-xs text-[#0A0A0A]">{faq.title}</span>
      </div>
    ),
    content: faq.content,
  }));

  return (
    <Container size="md" className="py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F5] rounded transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <Typography variant="h2">Perguntas Frequentes (FAQ)</Typography>
            <p className="text-xs text-[#737373]">Base de conhecimento e dúvidas frequentes sobre o Canal de Ética</p>
          </div>
        </div>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="space-y-4">
        <Input
          placeholder="Buscar por palavra-chave (ex: anonimato, prazos, protocolo)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
          className="bg-white"
        />

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#171717] text-[#FDC503]'
                  : 'bg-white border border-[#E5E5E5] text-[#525252] hover:border-[#171717] hover:text-[#171717]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <Surface variant="card" className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A]">
            <HelpCircle className="w-4 h-4 text-[#FDC503]" />
            <span>Perguntas e Respostas ({filteredFaqs.length})</span>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[11px] text-[#2563EB] hover:underline cursor-pointer"
            >
              Limpar busca
            </button>
          )}
        </div>

        {filteredFaqs.length > 0 ? (
          <Accordion items={accordionItems} allowMultiple />
        ) : (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[#A3A3A3] mx-auto" />
            <p className="text-xs text-[#525252]">Nenhuma pergunta encontrada para os termos pesquisados.</p>
            <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
              Resetar Filtros
            </Button>
          </div>
        )}
      </Surface>

      {/* CTA Box */}
      <div className="bg-[#171717] text-white p-6 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#262626]">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-heading font-bold text-sm text-white">Sua dúvida não foi listada aqui?</h4>
          <p className="text-xs text-[#A3A3A3]">Você pode registrar um comunicado direto selecionando a categoria "Dúvida".</p>
        </div>
        <Link to="/registrar">
          <Button variant="primary" size="sm" leftIcon={<FilePlus className="w-4 h-4" />}>
            Registrar Dúvida / Relato
          </Button>
        </Link>
      </div>
    </Container>
  );
}

