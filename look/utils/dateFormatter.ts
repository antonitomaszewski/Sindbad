export function formatDateRange(startDate: Date | string, endDate?: Date | string): string {
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