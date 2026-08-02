export interface VideoConfig {
  id: string;
  thumbnail: string;
  titleKey: string;
  duration: string;
  publishDate: string;
  descriptionKey: string;
  url: string;
}

export const videosConfig: VideoConfig[] = [
  {
    id: "video3",
    thumbnail: "https://img.youtube.com/vi/4ZPsD0oGQNs/maxresdefault.jpg",
    titleKey: "video3",
    duration: "59:08",
    publishDate: "2026-08-02",
    descriptionKey: "video3",
    url: "https://youtu.be/4ZPsD0oGQNs",
  },
  {
    id: "video1",
    thumbnail: "https://img.youtube.com/vi/zcBAGXo_v78/maxresdefault.jpg",
    titleKey: "video1",
    duration: "3:57",
    publishDate: "2025-07-27",
    descriptionKey: "video1",
    url: "https://youtu.be/zcBAGXo_v78",
  },
  {
    id: "video2",
    thumbnail: "https://img.youtube.com/vi/IDr8DSTl330/maxresdefault.jpg",
    titleKey: "video2",
    duration: "57:43",
    publishDate: "2025-07-25",
    descriptionKey: "video2",
    url: "https://www.youtube.com/watch?v=IDr8DSTl330",
  },
];
