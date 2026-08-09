import { NextResponse } from "next/server";

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return NextResponse.json({ error: "YouTube credentials not configured" }, { status: 500 });
  }

  try {
    // Get uploads playlist ID from channel
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=contentDetails`,
      { next: { revalidate: 3600 } }
    );
    if (!channelRes.ok) {
      return NextResponse.json({ error: "Failed to fetch channel data" }, { status: 502 });
    }
    const channelData = await channelRes.json();
    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      return NextResponse.json({ error: "Uploads playlist not found" }, { status: 404 });
    }

    // Fetch latest videos from uploads playlist
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=3`,
      { next: { revalidate: 3600 } }
    );
    if (!playlistRes.ok) {
      return NextResponse.json({ error: "Failed to fetch videos" }, { status: 502 });
    }
    const playlistData = await playlistRes.json();

    const videos = (playlistData.items || []).map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails?.maxres?.url ||
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        "",
      publishDate: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
