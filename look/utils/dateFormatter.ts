export function formatDateRange(startDate: Date | string, endDate?: Date | string): string {
  if (!startDate) return '';
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : null;
  
  if (end && end.getTime() !== start.getTime()) {
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }
  
  return start.toLocaleDateString();
}