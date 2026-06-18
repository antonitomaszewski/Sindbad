import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

interface Props {
  title: string;
  description: string;
  yacht_name: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onYachtNameChange: (value: string) => void;
  errors?: { title?: string };
}

export default function OfferBasicInfo({ 
  title, 
  description, 
  yacht_name,
  onTitleChange, 
  onDescriptionChange, 
  onYachtNameChange,
  errors 
}: Props) {
  return (
    <div className="space-y-4">
      <FormField label="Nazwa rejsu" required error={errors?.title}>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          error={!!errors?.title}
          placeholder="np. Rejs po Mazurach - lipiec 2026"
          maxLength={100}
        />
      </FormField>

      <FormField label="Opis rejsu">
        <p className="text-xs text-gray-500 mb-2">
          Podpowiedź: wpisz krótko jaki macie plan rejsu, trasę i klimat pływania.
        </p>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={6}
          placeholder="Np. Start w Gdańsku, 3 dni po Zatoce, postoje na kąpiel i wieczorne wejścia do portów."
        />
      </FormField>

      <FormField label="Nazwa Jachtu">
        <Input
        id="yacht_name"
        type="text"
        value={yacht_name}
        onChange={(e) => onYachtNameChange(e.target.value)}
        placeholder="Np. Joanna"
        ></Input>
      </FormField>
    </div>
  );
}