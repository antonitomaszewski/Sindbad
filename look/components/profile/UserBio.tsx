export default function UserBio({ bio }: { bio?: string }) {
  return (
    <section className="bg-white border border-gray-100 rounded-lg p-4">
      <h2 className="text-lg font-medium mb-2">O mnie</h2>
      <p className="text-gray-700 text-sm">{bio ?? 'Użytkownik nie dodał opisu.'}</p>
    </section>
  );
}