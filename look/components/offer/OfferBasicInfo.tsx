import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

interface Props {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  errors?: { title?: string };
}

export default function OfferBasicInfo({ 
  title, 
  description, 
  onTitleChange, 
  onDescriptionChange, 
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
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={6}
          placeholder="Opisz trasę, atrakcje, wymagania dla uczestników..."
        />
      </FormField>
    </div>
  );
}