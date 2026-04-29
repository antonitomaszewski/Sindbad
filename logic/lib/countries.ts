type Country = { code: string; name: string; namePL: string };

let cached: Country[] | null = null;

export async function getAllCountries(): Promise<Country[]> {
  if (cached) return cached;
  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name,translations');
    if (!res.ok) {
      console.error('REST Countries API error:', res.status);
      return [];
    }
    const data = await res.json();
    
    const list = (data || [])
      .map((c: any): Country | null => {
        const code = c.cca2?.toUpperCase();
        const name = c.name?.common;
        const namePL = c.translations?.pol?.common || name;
        
        if (!code || !name) return null;
        
        return { code, name, namePL };
      })
      .filter((item: Country | null): item is Country => item !== null)
      .sort((a: Country, b: Country) => a.namePL.localeCompare(b.namePL, 'pl'));
    
    cached = list;
    return list;
  } catch (err) {
    console.error('getAllCountries failed', err);
    return [];
  }
}