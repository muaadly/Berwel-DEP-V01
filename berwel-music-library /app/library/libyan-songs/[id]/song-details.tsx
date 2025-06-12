"use client"

import React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Eye, ExternalLink, User } from "lucide-react"
import { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent } from "@/components/enhanced-tabs"
import { createClient } from '@/lib/supabaseClient';
import { useUser } from '@/context/user-context'; // Import the useUser hook
import { SupabaseClient, Session } from '@supabase/supabase-js'; // Import SupabaseClient and Session types
import { toggleLikeAction } from '../../../actions'; // Corrected import path for the server action

// Define interface for individual comment fetched from Supabase
interface Comment {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
  // Optional user details fetched from join
  user: {
    id: string;
    email: string;
  } | null; // user might be null if the join fails or user is deleted
}

// Define a type specifically for the comment data returned by the insert with select query
interface InsertedCommentData {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
  user: { // User details from the join
    id: string;
    email: string;
  } | null; // user might be null if the join fails or user is deleted
}


// Update Song interface to include Supabase data structure
interface Song {
  id: string
  songName: string
  singerName: string
  category: string
  lyricsStatus: string
  writer: string
  composer: string
  year: string
  recordingStatus: string
  soundCloudLink: string
  views: number
  likes: number // This will now be the count from Supabase
  // Expecting just the image filename from the API
  image: string
  singerImage: string
  sheetMusic: string
  lyrics: string
  comments: Comment[]; // Array of fetched comments
  isLikedByUser: boolean; // Whether the current user has liked this song
}

interface SimilarSong {
  id: string
  songName: string
  singerName: string
  views: number
  likes: number
  // Expecting just the image filename from the API
  image: string
}

interface SongDetailsProps {
  song: Song
  similarSongs: SimilarSong[]
}

export function SongDetails({ song, similarSongs }: SongDetailsProps) {
  console.log("Value of song.singerImage:", song.singerImage);
  console.log("SongDetails component received song prop:", song);
  // Initialize liked state with the value from props
  const [isLiked, setIsLiked] = useState(song.isLikedByUser);
  const [currentLikes, setCurrentLikes] = useState(song.likes);
  const [comments, setComments] = useState<Comment[]>(song.comments);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null); // State for comment errors
  const isDatabaseBacked = song.id !== null; // Check if the song has a UUID from the database

  // Get user, loading state, and session from UserProvider context
  const { user, isLoading: isUserLoading, session } = useUser();

  // State for the Supabase client instance
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  // Effect to initialize or update the Supabase client when the session changes
  useEffect(() => {
    console.log("UserProvider Session in SongDetails effect:", session);
    // Only create/update client if session is available or explicitly null (after sign out)
    if (session !== undefined) { // Check for undefined to avoid running on initial render before context is ready
      const client = createClient();
      setSupabase(client);
      console.log("Supabase client set/updated in SongDetails effect.");
    }
  }, [session]); // Re-run effect when the session from context changes

  // Set up Realtime subscription for trending likes
  useEffect(() => {
    // Only subscribe if supabase client is available
    if (!supabase) return;

    const channel = supabase
      .channel('trending_likes_channel') // Choose a unique channel name
      .on(
        'postgres_changes',
        {
          event: 'UPDATE', // Listen for UPDATEs
          schema: 'public',
          table: 'trending',
          filter: `item_id=eq.${song.id}` // Filter for the current song
        },
        (payload) => {
          console.log('Realtime update on trending:', payload);
          if (payload.new && typeof payload.new.likes_count === 'number') {
            setCurrentLikes(payload.new.likes_count);
          }
        }
      )
       .on(
        'postgres_changes',
        {
          event: 'INSERT', // Also listen for INSERTs (for the first like)
          schema: 'public',
          table: 'trending',
          filter: `item_id=eq.${song.id}`
        },
        (payload) => {
          console.log('Realtime insert on trending:', payload);
          if (payload.new && typeof payload.new.likes_count === 'number') {
            setCurrentLikes(payload.new.likes_count);
          }
        }
      )
      .subscribe(); // Start the subscription

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [song.id, supabase]); // Re-run effect if song.id or supabase client changes

  // Effect to verify and set initial like status based on database
  useEffect(() => {
    // Check initial like status only if user is loaded, song has a UUID, and supabase client is available
    if (!isUserLoading && user && song?.id && supabase) {
        const checkInitialLikeStatus = async () => {
          setIsTogglingLike(true); // Indicate loading of like status
          console.log("Checking initial like status for:", { user_id: user.id, item_id: song.id, item_type: 'song' });

          const { data, error } = await supabase
            .from('likes')
            .select('user_id')
            .eq('user_id', user.id)
            .eq('item_id', song.id) // Use song.id (the UUID)
            .eq('item_type', 'song')
            .maybeSingle();

          if (error) {
            console.error('Error checking initial user like status:', error);
          } else {
            // Set isLiked state based on whether a like record exists in the database
            setIsLiked(!!data); // !! converts truthy/falsy to boolean
            console.log('Initial like status set to:', !!data);
          }
          setIsTogglingLike(false); // Done loading
        };

        checkInitialLikeStatus();
    } else if (!isUserLoading && !user) {
       // If user is not loaded and is null, ensure like status is false and not loading
       setIsLiked(false);
       setIsTogglingLike(false); // Ensure loading is false if no user
    }

  }, [user, song.id, supabase, isUserLoading]); // Re-run if user, song ID, supabase, or user loading state changes

  // Function to handle like toggle
  const handleLikeToggle = async () => {
    console.log("handleLikeToggle called. Initial state:", {
      isTogglingLike,
      user: user ? { id: user.id, email: user.email } : null,
      isDatabaseBacked: song.id !== null,
      songId: song.id,
      // isSupabaseClientAvailable: !!supabase // Check if supabase client is available
    });

    // Disable if already toggling, no user, or not database backed
    // No need to check for supabase client availability here since we'll use a server action
    if (isTogglingLike || !user || !isDatabaseBacked) {
      console.log("Like toggle disabled. Reason:", {
        isTogglingLike,
        userExists: !!user,
        isDatabaseBacked,
        combinedCondition: isTogglingLike || !user || !isDatabaseBacked,
        // isSupabaseClientAvailable: !!supabase
      });
      if (!user) {
        alert('Please log in to like items.');
        return;
      }
      if (!song.id) {
        console.error("Cannot toggle like: Song ID is null (not found in database).");
        alert("Failed to update like status: Song not linked to database entry.");
        return;
      }
    }

    try {
      setIsTogglingLike(true);
      setCommentError(null);

      const itemId = song.id;
      const itemType = 'song'; // Assuming item_type is always 'song' for this component
      const userId = user.id;

      console.log("Starting like toggle operation:", { 
        itemId, 
        itemType, 
        userId, 
        isLiked,
        types: {
          itemIdType: typeof itemId,
          userIdType: typeof userId
        }
      });

      if (isLiked) {
        // Unlike the item
        console.log('[Frontend] Calling Server Action to unlike item:', { itemId, userId });
        const result = await toggleLikeAction(itemId, userId, true); // Call the server action

        if (!result.success) {
          console.error('[Frontend] Error from Server Action (unlike):', result.error);
          throw new Error(result.error || 'Failed to unlike item via server.');
        }

        console.log('[Frontend] Unlike successful via Server Action');
        setIsLiked(false);
        setCurrentLikes(prev => prev - 1);
      } else {
        // Like the item
        console.log('[Frontend] Calling Server Action to like item:', { itemId, userId });
        const result = await toggleLikeAction(itemId, userId, false); // Call the server action

        if (!result.success) {
          console.error('[Frontend] Error from Server Action (like):', result.error);
          throw new Error(result.error || 'Failed to like item via server.');
        }

        console.log('[Frontend] Like successful via Server Action');
        setIsLiked(true);
        setCurrentLikes(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('Error during like toggle operation:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        stack: error.stack
      });
      alert('Failed to update like status. Please try again.');
    } finally {
      console.log('Resetting isTogglingLike state');
      setIsTogglingLike(false);
    }
  };

  // Function to handle comment submission
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError(null); // Clear previous errors

    if (!user) {
       setCommentError('Please log in to post comments.'); // Set error message
       return;
     }

    if (!newCommentText.trim()) {
      setCommentError('Comment cannot be empty.'); // Set error message
      return;
    }

    if (isSubmittingComment) return; // Prevent multiple submissions
    setIsSubmittingComment(true);

    const item_id = song.id;
    const item_type = 'song'; // Or dynamically determined
    const user_id = user.id;
    const content = newCommentText.trim();

    const { data: newComment, error } = await supabase
      .from('comments')
      .insert({
        user_id: user_id,
        item_id: item_id,
        item_type: item_type,
        content: content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error posting comment:', error);
      setCommentError('Failed to post comment: ' + error.message);
    } else if (newComment) {
      // Fetch the user details separately
      const { data: userData } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', user_id)
        .single();

      const addedComment: InsertedCommentData = {
        ...newComment,
        user: userData
      };
      
      setComments(prevComments => [addedComment, ...prevComments]);
      setNewCommentText('');
    }

    setIsSubmittingComment(false);
  };

  // Construct the full image URL using the base path and the filename from the API
  // Relying directly on the image path provided by the API
  const singerImageUrl = song.singerImage || "/placeholder.svg";


  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="mb-4 flex items-center gap-2">
            <Link href="/library" className="text-sm text-gray-400 hover:underline">
              Library
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/library/libyan-songs" className="text-sm text-gray-400 hover:underline">
              Libyan Songs
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm font-medium">{song.songName}</span>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Left column - Singer image */}
            <div className="md:col-span-1">
              <div className="overflow-hidden rounded-lg border-2 border-white">
                <Image
                  src={singerImageUrl}
                  alt={`Image of ${song.singerName}`}
                  width={400}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            </div>

            {/* Middle column - Song details */}
            <div className="md:col-span-2">
              <h1 className="mb-6 text-3xl font-bold">{song.songName}</h1>

              {/* Enhanced attributes section with borders */}
              <div className="mb-8 overflow-hidden rounded-lg border border-white/30 bg-gray-900/30">
                <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                  {/* First column */}
                  <div className="flex flex-col divide-y divide-white/10">
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Singer</p>
                      <p className="text-lg font-medium">{song.singerName}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Writer</p>
                      <p className="font-medium">{song.writer}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Recording Status</p>
                      <p className="font-medium">{song.recordingStatus}</p>
                    </div>
                  </div>

                  {/* Second column */}
                  <div className="flex flex-col divide-y divide-white/10">
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="font-medium">{song.category}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Composer</p>
                      <p className="font-medium">{song.composer}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">SoundCloud Link</p>
                      <a
                        href={song.soundCloudLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-amber-500 hover:text-amber-400 transition-colors"
                      >
                        <span className="truncate">Listen on SoundCloud</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Third column */}
                  <div className="flex flex-col divide-y divide-white/10">
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Lyrics Status</p>
                      <p className="font-medium">{song.lyricsStatus}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Year</p>
                      <p className="font-medium">{song.year}</p>
                    </div>
                    <div className="p-4 sm:invisible"></div>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex flex-wrap items-center gap-4">
                <Button
                  variant="outline"
                  className={`flex items-center gap-1 rounded-md border border-white/20 px-3 py-2 transition-colors hover:border-white/30 ${isLiked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-300"}`}
                  onClick={handleLikeToggle}
                  disabled={isTogglingLike || !user}
                >
                  <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                  <span className="sr-only">Like</span>
                </Button>

                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full text-gray-400">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>

                <div className="flex items-center gap-1 text-gray-400">
                  <span>{currentLikes.toLocaleString()} Likes</span>
                </div>
              </div>

              {/* Tabs section */}
              <EnhancedTabs defaultValue="lyrics" className="w-full">
                <EnhancedTabsList className="w-full border border-white/50 flex">
                  <EnhancedTabsTrigger value="lyrics" className="py-3 px-4 flex-1">
                    Lyrics
                  </EnhancedTabsTrigger>
                  <EnhancedTabsTrigger value="comments" className="py-3 px-4 flex-1">
                    Comments ({comments.length})
                  </EnhancedTabsTrigger>
                </EnhancedTabsList>

                <EnhancedTabsContent value="lyrics" className="mt-4 rounded-lg border-2 border-white bg-gray-950 p-6">
                  <div className="whitespace-pre-line text-right" dir="rtl">
                    {song.lyrics}
                  </div>
                </EnhancedTabsContent>

                <EnhancedTabsContent value="comments" className="mt-4 rounded-lg border-2 border-white bg-gray-950 p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {comments && comments.length > 0 ? (
                        <div className="space-y-4">
                          {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <div className="flex-shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
                                  <User className="h-5 w-5 text-gray-400" />
                                </div>
                              </div>
                              <div className="flex-1 border-b border-white/10 pb-4 last:border-0">
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="font-medium">{comment.user?.email || 'Unknown User'}</span>
                                  <span className="text-sm text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                                </div>
                                <p className="text-gray-300">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No comments yet.</p>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="mb-4 text-lg font-medium">Add a Comment</h3>
                       {user ? (
                         <form className="space-y-4" onSubmit={handlePostComment}>
                           <div className="flex items-center gap-3 mb-4">
                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500">
                               <span className="text-sm font-bold text-black">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
                             </div>
                             <div>
                               <p className="font-medium">{user?.email || 'Logged In'}</p>
                               <p className="text-xs text-gray-400">Logged in</p>
                             </div>
                           </div>

                           <div>
                             <label htmlFor="comment-text" className="mb-2 block text-sm font-medium text-gray-300">
                               Comment
                             </label>
                             <textarea
                               id="comment-text"
                               rows={4}
                               className="w-full rounded-md border border-white/20 bg-gray-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                               placeholder="Share your thoughts about this song..."
                               value={newCommentText}
                               onChange={(e) => setNewCommentText(e.target.value)}
                               disabled={isSubmittingComment}
                             ></textarea>
                           </div>
                           <button
                             type="submit"
                             className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-600 focus:outline-none"
                             disabled={isSubmittingComment || !newCommentText.trim()}
                           >
                             {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                           </button>
                         </form>
                       ) : (
                         <p className="text-gray-400">Please log in to post a comment.</p>
                       )}
                       {/* Display comment error message */}
                       {commentError && <p className="text-red-500 text-sm mt-2">{commentError}</p>}
                    </div>
                  </div>
                </EnhancedTabsContent>
              </EnhancedTabs>
            </div>
          </div>

          {/* Similar Songs section */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Similar Songs</h2>
            {/* Adjusted grid for smaller boxes and more columns on larger screens */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {/* Limit to a maximum of 4 similar songs and map over them */}
              {similarSongs.slice(0, 4).map((similarSong) => (
                <Link
                  key={similarSong.id}
                  href={`/library/libyan-songs/${similarSong.id}`}
                  className="group rounded-lg border-2 border-white bg-gray-950 p-4 transition-colors hover:border-white/40 flex items-center gap-4"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    {/* Use image path directly from API for similar songs */}
                    <Image
                      src={similarSong.image ? `/R_Images/Singers_Images/${similarSong.image}` : "/placeholder.svg"}
                      alt={`Image of ${similarSong.singerName}`}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium group-hover:text-amber-500">{similarSong.songName}</h3>
                    <p className="text-sm text-gray-400">{similarSong.singerName}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      {/* Display likes count instead of views */}
                      <Heart className="h-3 w-3" />
                      <span>{similarSong.likes.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}