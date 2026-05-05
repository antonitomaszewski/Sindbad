interface Props {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  errors?: { title?: string };
}

export default function OfferBasicInfo({ title, description, onTitleChange, onDescriptionChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Nazwa rejsu <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors?.title ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="np. Rejs po Mazurach - lipiec 2026"
          maxLength={100}
        />
        {errors?.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Opis rejsu
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
          placeholder="Opisz trasę, atrakcje, wymagania dla uczestników..."
        />
      </div>
    </div>
  );
}