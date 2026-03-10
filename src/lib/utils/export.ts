import type { Observation } from '@/lib/data/types';

export async function generateCSV(observations: Observation[]): Promise<void> {
  const Papa = (await import('papaparse')).default;

  const rows = observations.map((obs) => ({
    date: new Date(obs.observed_at).toLocaleDateString('en-AU'),
    time: new Date(obs.observed_at).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
    parent: obs.profile?.display_name ?? '',
    category: obs.category,
    sign: obs.sign_label,
    intensity: obs.intensity,
    note: obs.note ?? '',
    context: obs.context ?? '',
    source: obs.source,
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `adhd-observer-export-${dateStr}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function generatePDF(
  observations: Observation[],
  dateRange: { from: Date; to: Date }
): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Cover page
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ADHD Observer', pageWidth / 2, y + 40, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Observation Report', pageWidth / 2, y + 52, { align: 'center' });

  doc.setFontSize(11);
  const fromStr = dateRange.from.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const toStr = dateRange.to.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.text(`${fromStr} — ${toStr}`, pageWidth / 2, y + 64, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    `Generated ${new Date().toLocaleDateString('en-AU')}`,
    pageWidth / 2,
    y + 76,
    { align: 'center' }
  );

  // Summary page
  doc.addPage();
  y = margin;
  doc.setTextColor(0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total observations: ${observations.length}`, margin, y);
  y += 7;

  // Count by category
  const categoryCounts: Record<string, number> = {};
  for (const obs of observations) {
    categoryCounts[obs.category] = (categoryCounts[obs.category] ?? 0) + 1;
  }

  doc.setFont('helvetica', 'bold');
  doc.text('By category:', margin, y);
  y += 7;
  doc.setFont('helvetica', 'normal');

  for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    doc.text(`  ${cat}: ${count}`, margin, y);
    y += 6;
  }

  // Observations table
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Observations', margin, y);
  y += 8;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const colWidths = [22, 30, 30, 18, contentWidth - 100];
  const headers = ['Date', 'Category', 'Sign', 'Intensity', 'Note'];

  headers.forEach((h, i) => {
    const x = margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
    doc.text(h, x, y);
  });

  y += 4;
  doc.setDrawColor(200);
  doc.line(margin, y, margin + contentWidth, y);
  y += 3;

  doc.setFont('helvetica', 'normal');

  for (const obs of observations) {
    if (y > 270) {
      doc.addPage();
      y = margin;
    }

    const row = [
      new Date(obs.observed_at).toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit' }),
      obs.category,
      obs.sign_label,
      String(obs.intensity),
      (obs.note ?? '').slice(0, 40),
    ];

    row.forEach((cell, i) => {
      const x = margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.text(cell, x, y);
    });

    y += 5;
  }

  // Disclaimer
  y += 10;
  if (y > 260) {
    doc.addPage();
    y = margin;
  }
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    'This report is for informational purposes only and does not constitute medical advice.',
    margin,
    y
  );
  doc.text(
    'Always consult a qualified healthcare professional for evaluation.',
    margin,
    y + 4
  );

  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`adhd-observer-report-${dateStr}.pdf`);
}
