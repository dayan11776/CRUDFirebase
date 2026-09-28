import { Contact } from '../types/contact';

export function exportToCSV(contacts: Contact[], filename = 'contacts.csv') {
  // Only the 4 requested columns: Name, Email, Contact Number, Gender
  const headers = ['Name', 'Email', 'Contact Number', 'Gender'];
  const rows = contacts.map((c) => [
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${(c.email || '').replace(/"/g, '""')}"`,
    `"${(c.contactNumber || '').replace(/"/g, '""')}"`,
    `"${(c.gender || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(contacts: Contact[], filename = 'contacts.json') {
  const exportData = contacts.map((c) => ({
    name: c.name,
    email: c.email,
    'contact number': c.contactNumber,
    gender: c.gender,
  }));
  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
