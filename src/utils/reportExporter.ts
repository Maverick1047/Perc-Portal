import { StoreUnit, Evaluation, Brand } from '../types';

/**
 * Generates and downloads a clean, formatted CSV/Excel spreadsheet
 * with BOM (\uFEFF) for UTF-8 compatibility in Microsoft Excel.
 */
export const downloadHistoryExcel = (unit: StoreUnit, evaluations: Evaluation[]) => {
  const isAsturiano = unit.brand === 'Asturiano';
  const currentDate = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // UTF-8 BOM to ensure Excel opens accents and special characters properly
  let csv = '\uFEFF';

  // Corporate Header
  csv += `"GRUPO PERC - REPORTE EJECUTIVO DE AUDITORÍAS DE SERVICIO"\n`;
  csv += `"Marca:",${isAsturiano ? '"Tiendas Asturiano"' : '"Estaciones Flash"'}\n`;
  csv += `"Unidad:",${JSON.stringify(unit.name)},"Código:",${JSON.stringify(unit.code)}\n`;
  csv += `"Zona:",${JSON.stringify(unit.zone)},"Dirección:",${JSON.stringify(unit.address || 'N/A')}\n`;
  csv += `"Gerente/Encargado:",${JSON.stringify(unit.manager || 'N/A')},"Teléfono:",${JSON.stringify(unit.phone || 'N/A')}\n`;
  csv += `"Auditor Asignado:",${JSON.stringify(unit.evaluatorAssigned || 'N/A')},"Fecha de Emisión:",${JSON.stringify(currentDate)}\n`;
  csv += `"Total Auditorías:",${evaluations.length},"Escala Oficial:",${isAsturiano ? '"15.00 Puntos"' : '"100 Puntos"'}\n\n`;

  // Summary Table Header
  csv += `"Folio","Fecha","Auditor","Calificación (%)","Puntos Obtenidos","Puntos Máx","Meta PERC (85%)","Estatus","Videos","Fotos","Observaciones"\n`;

  evaluations.forEach((ev, idx) => {
    const folio = `AUD-${unit.code}-${ev.evaluationDate.replace(/-/g, '')}-${idx + 1}`;
    const videosCount = ev.evidences.filter(e => e.type === 'video').length;
    const photosCount = ev.evidences.filter(e => e.type === 'photo').length;
    const metaCumplida = ev.generalScore >= 85 ? 'Cumplida' : 'Oportunidad';
    const comments = (ev.generalComments || '').replace(/"/g, '""');

    csv += `"${folio}","${ev.evaluationDate}","${ev.auditorName}",${ev.generalScore}%,${ev.totalPointsAchieved},${ev.totalPointsMax},"${metaCumplida}","${ev.status}",${videosCount},${photosCount},"${comments}"\n`;
  });

  csv += '\n';

  // Criteria Breakdown Matrix
  csv += `"DESGLOSE DETALLADO DE LOS 10 CRITERIOS EVALUADOS"\n`;
  csv += `"Fecha","Criterio","Puntos Máx","Puntos Obtenidos","Cumplimiento (%)","Notas / Hallazgos"\n`;

  evaluations.forEach(ev => {
    (ev.criteriaBreakdown || []).forEach(c => {
      const pct = c.maxPoints > 0 ? Math.round((c.achievedPoints / c.maxPoints) * 100) : 0;
      const notes = (c.notes || '').replace(/"/g, '""');
      csv += `"${ev.evaluationDate}","${c.name}",${c.maxPoints},${c.achievedPoints},${pct}%,"${notes}"\n`;
    });
  });

  // Create downloadable blob
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const sanitizedUnitName = unit.name.replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `Reporte_Auditorias_${unit.brand}_${sanitizedUnitName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Triggers a formatted printable PDF layout in a new window or print iframe
 * using the official brand color system (Red/Gold for Asturiano, Orange/Amber for Flash).
 */
export const printHistoryReport = (unit: StoreUnit, evaluations: Evaluation[]) => {
  const isAsturiano = unit.brand === 'Asturiano';
  const primaryColor = isAsturiano ? '#991B1B' : '#EA580C';
  const secondaryColor = isAsturiano ? '#D4AF37' : '#F59E0B';
  const brandName = isAsturiano ? 'Tiendas Asturiano' : 'Estaciones Flash';
  const brandScale = isAsturiano ? '15.00 Puntos' : '100 Puntos';

  const todayStr = new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const avgScore = evaluations.length > 0
    ? Math.round((evaluations.reduce((acc, curr) => acc + curr.generalScore, 0) / evaluations.length) * 10) / 10
    : 0;

  const latestScore = evaluations[0]?.generalScore ?? 0;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte de Auditorías - ${unit.name} | Grupo PERC</title>
  <style>
    @page {
      size: letter portrait;
      margin: 15mm 15mm 20mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.4;
    }
    .header {
      background: linear-gradient(135deg, ${primaryColor} 0%, #000000 100%);
      color: #ffffff;
      padding: 24px;
      border-radius: 12px;
      border-bottom: 4px solid ${secondaryColor};
      margin-bottom: 20px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .brand-kicker {
      text-transform: uppercase;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 2px;
      color: ${secondaryColor};
    }
    .folio {
      font-size: 10px;
      color: #cbd5e1;
      font-family: monospace;
    }
    .title {
      font-size: 22px;
      font-weight: 900;
      margin: 0 0 6px 0;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 11px;
      color: #e2e8f0;
      margin: 0;
    }
    .dossier-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #f8fafc;
      padding: 14px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }
    .dossier-item label {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      display: block;
      margin-bottom: 2px;
    }
    .dossier-item strong {
      font-size: 12px;
      color: #0f172a;
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .kpi-card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
      background: #ffffff;
      text-align: center;
    }
    .kpi-card .val {
      font-size: 22px;
      font-weight: 900;
      color: ${primaryColor};
      margin: 4px 0;
    }
    .kpi-card .lbl {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin: 20px 0 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 10.5px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-align: left;
      padding: 8px 10px;
      border-bottom: 2px solid #cbd5e1;
      text-transform: uppercase;
      font-size: 9px;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }
    tr:nth-child(even) td {
      background-color: #fafbfc;
    }
    .score-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 11px;
    }
    .score-green {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    .score-amber {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .score-red {
      background: #ffe4e6;
      color: #9f1239;
      border: 1px solid #fecdd3;
    }
    .signature-area {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 40px;
      page-break-inside: avoid;
    }
    .signature-line {
      border-top: 1px solid #94a3b8;
      text-align: center;
      padding-top: 6px;
      font-size: 10px;
      color: #475569;
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 9px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="header-top">
      <div class="brand-kicker">GRUPO PERC • CONTROL DE CALIDAD Y SERVICIO</div>
      <div class="folio">FOLIO: PERC-${unit.code}-${Date.now().toString().slice(-6)}</div>
    </div>
    <h1 class="title">${unit.name} (${unit.code})</h1>
    <p class="subtitle">Reporte Consolidado de Auditorías • ${brandName} • Escala Oficial: ${brandScale}</p>
  </div>

  <div class="dossier-grid">
    <div class="dossier-item">
      <label>Marca & Zona</label>
      <strong>${brandName} · ${unit.zone}</strong>
    </div>
    <div class="dossier-item">
      <label>Dirección</label>
      <strong>${unit.address || 'Ubicación Registrada'}</strong>
    </div>
    <div class="dossier-item">
      <label>Gerente / Encargado</label>
      <strong>${unit.manager || 'No asignado'}</strong>
    </div>
    <div class="dossier-item">
      <label>Auditor en Ruta</label>
      <strong>${unit.evaluatorAssigned || 'Auditoría Central'}</strong>
    </div>
  </div>

  <div class="kpi-row">
    <div class="kpi-card">
      <div class="lbl">Promedio Histórico</div>
      <div class="val">${avgScore}%</div>
      <small style="color: #64748b;">${evaluations.length} auditoría(s)</small>
    </div>
    <div class="kpi-card">
      <div class="lbl">Última Calificación</div>
      <div class="val">${latestScore}%</div>
      <small style="color: #64748b;">${evaluations[0]?.evaluationDate || 'N/A'}</small>
    </div>
    <div class="kpi-card">
      <div class="lbl">Meta Institucional</div>
      <div class="val" style="color: #10b981;">85.0%</div>
      <small style="color: #10b981; font-weight: 600;">Grupo PERC</small>
    </div>
    <div class="kpi-card">
      <div class="lbl">Estatus de Calidad</div>
      <div class="val" style="font-size: 15px; color: ${latestScore >= 85 ? '#166534' : '#92400e'};">
        ${latestScore >= 85 ? 'Meta Cumplida' : 'En Oportunidad'}
      </div>
      <small style="color: #64748b;">vs Criterio 2026</small>
    </div>
  </div>

  <div class="section-title">
    <span>Historial Cronológico de Visitas</span>
    <span style="font-size: 10px; font-weight: 400; color: #64748b;">Total: ${evaluations.length} visitas</span>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 85px;">Fecha</th>
        <th style="width: 140px;">Auditor</th>
        <th style="width: 90px; text-align: center;">Calificación</th>
        <th style="width: 110px; text-align: center;">Puntos</th>
        <th style="width: 80px; text-align: center;">Evidencias</th>
        <th>Comentarios Generales y Observaciones</th>
      </tr>
    </thead>
    <tbody>
      ${evaluations.map(ev => {
        const scoreClass = ev.generalScore >= 85 ? 'score-green' : ev.generalScore >= 72 ? 'score-amber' : 'score-red';
        const vCount = ev.evidences.filter(e => e.type === 'video').length;
        const pCount = ev.evidences.filter(e => e.type === 'photo').length;

        return `
          <tr>
            <td style="font-weight: 700;">${ev.evaluationDate}</td>
            <td>${ev.auditorName}</td>
            <td style="text-align: center;">
              <span class="score-badge ${scoreClass}">${ev.generalScore}%</span>
            </td>
            <td style="text-align: center; font-family: monospace;">${ev.totalPointsAchieved} / ${ev.totalPointsMax} pts</td>
            <td style="text-align: center; font-size: 9.5px; color: #475569;">
              ${vCount > 0 ? `${vCount} Video ` : ''}${pCount} Fotos
            </td>
            <td style="color: #334155;">"${ev.generalComments}"</td>
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>

  ${evaluations[0]?.criteriaBreakdown ? `
    <div class="section-title" style="page-break-before: auto;">
      <span>Desglose de los 10 Criterios Oficiales (Última Visita)</span>
      <span style="font-size: 10px; font-weight: 400; color: #64748b;">${evaluations[0].evaluationDate}</span>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 30px;">#</th>
          <th>Criterio Evaluado</th>
          <th style="width: 80px; text-align: center;">Puntos Máx</th>
          <th style="width: 90px; text-align: center;">Puntos Logrados</th>
          <th style="width: 80px; text-align: center;">Cumplimiento</th>
          <th>Notas y Hallazgos del Auditor</th>
        </tr>
      </thead>
      <tbody>
        ${evaluations[0].criteriaBreakdown.map((c, i) => {
          const pct = c.maxPoints > 0 ? Math.round((c.achievedPoints / c.maxPoints) * 100) : 0;
          const pctClass = pct >= 85 ? 'score-green' : pct >= 70 ? 'score-amber' : 'score-red';
          return `
            <tr>
              <td style="font-weight: bold; color: #94a3b8;">${i + 1}</td>
              <td style="font-weight: 600;">${c.name}</td>
              <td style="text-align: center; font-family: monospace;">${c.maxPoints} pts</td>
              <td style="text-align: center; font-family: monospace; font-weight: 700;">${c.achievedPoints} pts</td>
              <td style="text-align: center;">
                <span class="score-badge ${pctClass}">${pct}%</span>
              </td>
              <td style="color: #475569; font-size: 10px;">${c.notes || 'Sin desviaciones reportadas.'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  ` : ''}

  <div class="signature-area">
    <div>
      <div style="height: 40px;"></div>
      <div class="signature-line">
        <strong>${evaluations[0]?.auditorName || 'Auditor Responsable'}</strong><br>
        Auditoría Operativa y Calidad en Ruta · Grupo PERC
      </div>
    </div>
    <div>
      <div style="height: 40px;"></div>
      <div class="signature-line">
        <strong>${unit.manager || 'Gerente / Encargado de Unidad'}</strong><br>
        Acuse de Recepción · ${unit.name}
      </div>
    </div>
  </div>

  <div class="footer">
    <div>PercPortal · Sistema Institucional de Calidad Grupo PERC</div>
    <div>Generado el ${todayStr} · Documento confidencial interno</div>
  </div>

</body>
</html>
  `;

  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    // Wait for styles to parse then prompt print dialog
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  } else {
    // Fallback if popups are blocked: create an iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 2000);
      }, 400);
    }
  }
};
