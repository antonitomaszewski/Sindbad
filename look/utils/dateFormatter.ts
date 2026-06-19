export function formatDateRange(startDate?: Date | string, endDate?: Date | string): string {
  if (!startDate) return '';
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : null;
  
  if (end && end.getTime() !== start.getTime()) {
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }
  
  return start.toLocaleDateString();
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getDuration(startDate: Date | string, endDate: Date | string): String{
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : null;

  if (end && start)
    return ((end.getTime() - start?.getTime()) / (1000 * 60 * 60 * 24)).toString();
  return "" 
}

export function dateToString(date: Date | null): string | undefined {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '';
  }
}

// function formatDate(value: Date | null): string | undefined {
//   return value ? value.toISOString().split('T')[0] : undefined;
// }