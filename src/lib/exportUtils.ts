/**
 * Utilitários de Exportação de Dados (PDF e Excel/CSV)
 * Padrão Grupo Bairral - Canal de Ética e Integridade
 */

export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  const sanitizeCell = (cell: any) => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(sanitizeCell).join(';');
  const rowLines = rows.map((row) => row.map(sanitizeCell).join(';'));
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/[^a-z0-9_-]/gi, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(
  documentTitle: string,
  subtitle: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][],
  filename?: string
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita popups para gerar a visualização e impressão em PDF.');
    return;
  }

  const currentDate = new Date().toLocaleString('pt-BR');
  const safeFilename = filename || documentTitle.toLowerCase().replace(/[^a-z0-9_-]/gi, '_');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>${documentTitle} - Grupo Bairral</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 15mm;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 11px;
          color: #171717;
          margin: 0;
          padding: 20px;
          background: #ffffff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #004B87;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .brand {
          font-size: 18px;
          font-weight: 800;
          color: #004B87;
          letter-spacing: -0.5px;
        }
        .brand span {
          color: #107C41;
        }
        .meta {
          text-align: right;
          font-size: 10px;
          color: #737373;
        }
        .doc-title {
          font-size: 15px;
          font-weight: 700;
          color: #0A0A0A;
          margin: 0 0 4px 0;
        }
        .doc-subtitle {
          font-size: 11px;
          color: #525252;
          margin: 0 0 16px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th {
          background-color: #004B87;
          color: #ffffff;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 9px;
          padding: 8px 10px;
          text-align: left;
          letter-spacing: 0.5px;
        }
        td {
          padding: 7px 10px;
          border-bottom: 1px solid #E5E5E5;
          font-size: 10px;
        }
        tr:nth-child(even) td {
          background-color: #FAFAFA;
        }
        .footer {
          margin-top: 24px;
          border-top: 1px solid #E5E5E5;
          padding-top: 8px;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #A3A3A3;
        }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 15px; text-align: right;">
        <button onclick="window.print()" style="background-color: #004B87; color: white; border: none; padding: 8px 16px; font-weight: bold; border-radius: 4px; cursor: pointer;">
          🖨️ Imprimir / Salvar como PDF
        </button>
      </div>

      <div class="header">
        <div>
          <div class="brand">Grupo <span>Bairral</span></div>
          <div style="font-size: 10px; color: #525252; font-weight: 600;">Portal de Governança, Ética & Integridade</div>
        </div>
        <div class="meta">
          <div><strong>Emissão:</strong> ${currentDate}</div>
          <div><strong>Total de Registros:</strong> ${rows.length}</div>
        </div>
      </div>

      <h1 class="doc-title">${documentTitle}</h1>
      <p class="doc-subtitle">${subtitle}</p>

      <table>
        <thead>
          <tr>
            ${headers.map((h) => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
            <tr>
              ${row.map((cell) => `<td>${cell !== null && cell !== undefined ? String(cell) : '-'}</td>`).join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer">
        <div>Documento confidencial para uso exclusivo das instâncias de governança do Grupo Bairral.</div>
        <div>Página 1 de 1</div>
      </div>

      <script>
        setTimeout(() => {
          window.print();
        }, 500);
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
