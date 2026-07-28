interface Categorizable {
  category: string;
}

interface Searchable {
  title: string;
  description?: string;
  shortDescription?: string;
}

export function filterByCategory<T extends Categorizable>(
  items: T[],
  category: string
): T[] {
  if (category === "All" || category === "") return items;
  return items.filter((item) => item.category === category);
}

export function filterBySearch<T extends Searchable>(
  items: T[],
  query: string
): T[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.shortDescription?.toLowerCase().includes(q)
  );
}

export function sortByPopularity<T extends { reviews: number }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => b.reviews - a.reviews);
}

export function sortByNewest<T extends { createdAt: string }>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
