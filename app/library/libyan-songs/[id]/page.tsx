"use client"

import { useEffect, useState } from "react";
import { SongDetails } from "./song-details";

export default function LibyanSongPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [song, setSong] = useState<any>(null);
  const [similarSongs, setSimilarSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/libyan-songs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSong(data.song);
        setSimilarSongs(data.similarSongs);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load song.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading song...</div>;
  }

  if (error || !song) {
    return <div className="text-center py-8 text-red-500">{error || "Song not found."}</div>;
  }

  // Dynamically construct the singer image path using the 'singerImage' property from the API
  // The API now returns just the filename, so we need to add the full path
  const singerImage = song.singerName === 'أحمد فكرون'
    ? '/R_Images/Singers_Images/AhmedFakroun.jpeg'
    : song.singerImage
      ? `/R_Images/Singers_Images/${song.singerImage}`
      : "/placeholder.svg";

  // Pass all required fields to SongDetails, using the correct property names from the API response
  const songDetails = {
    id: song.id, // Use song.id from API (should be UUID or null)
    songName: song.songName, // Use song.songName from API
    singerName: song.singerName, // Use song.singerName from API
    category: song.category,
    lyricsStatus: song.lyricsStatus,
    writer: song.writer,
    composer: song.composer,
    year: song.year,
    recordingStatus: song.recordingStatus,
    soundCloudLink: song.soundCloudLink,
    lyrics: song.lyrics,
    singerImage, // Use the constructed singerImage URL
    // These are now expected directly from the API with correct names
    views: song.views || 0,
    likes_count: song.likes_count || 0,
    image: song.image ? `/R_Images/Singers_Images/${song.image}` : "/placeholder.svg", // Ensure similar song image also has full path
    sheetMusic: song.sheetMusic || "",
    comments: song.comments || [],
    isLikedByUser: song.isLikedByUser, // Use isLikedByUser from API
  };

  // Pass similarSongs to SongDetails - similarSongs array items also need updated property names
  const similarSongsWithCorrectedImages = similarSongs.map(similarSong => ({
    id: similarSong.id, // Assuming similar song ID is correct
    songName: similarSong.songName, // Use songName from API
    singerName: similarSong.singerName, // Use singerName from API
    // Use image path directly from API for similar songs
    image: similarSong.image ? `/R_Images/Singers_Images/${similarSong.image}` : "/placeholder.svg", // Ensure full path for similar song images
    likes: similarSong.likes || 0, // Use likes from API (assuming similarSong API still uses 'likes')
    views: similarSong.views || 0, // Added views property
  }));

  return <SongDetails song={songDetails} similarSongs={similarSongsWithCorrectedImages} />;
}
