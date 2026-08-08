export interface VideoConfig {
  id: string;
  thumbnail: string;
  title: string;
  duration: string;
  publishDate: string;
  description: string;
  url: string;
}

export async function getVideos(): Promise<VideoConfig[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/youtube`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch videos");
  }

  return response.json();
}