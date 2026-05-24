import { Card } from '@/look/components/ui/Card';

const COLOR_MAP: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700',
};

export default function Certifications({ certifications }: { certifications: string[] }) {
  return (
    <Card className="mb-0">
      <h4 className="text-md font-medium mb-3">Uprawnienia żeglarskie</h4>

      {certifications.length === 0 ? (
        <p className="text-gray-600 text-sm">Brak przypisanych uprawnień.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {certifications.map((c) => {
            const cls = COLOR_MAP.default;
            return (
              <span key={c} className={`text-sm px-2 py-1 rounded-full ${cls}`}>
                {c}
              </span>
            );
          })}
        </div>
      )}
    </Card>
  );
}