import { NotFoundState } from '../components/common/NotFoundState';

export default function NotFound() {
  return (
    <NotFoundState
      title="404"
      message="Strona nie istnieje"
      description="Strona, której szukasz, nie została znaleziona."
      backUrl="/"
      backText="Wróć na stronę główną"
    />
  );
}
