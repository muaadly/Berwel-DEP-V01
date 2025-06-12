"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Eye, User } from "lucide-react"
import { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent } from "@/components/enhanced-tabs"
import { createClient } from '@/lib/supabaseClient'

interface Comment {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
  user?: {
    name: string;
    avatar_url: string | null;
  };
}

type MaloofEntry = {
  id: string
  entryName: string
  entryType: string
  entryRhythm: string
  composer: string
  origin: string
  period: string
  recordingStatus: string
  soundCloudLink: string
  views: number
  likes: number
  image: string
  entryImage: string
  noteImage: string
  lyrics: string
  notes: string
  comments: Comment[]
  isLikedByUser: boolean
}

type SimilarEntry = {
  id: string
  entryName: string
  entryType: string
  entryRhythm: string
  image: string
}

interface MaloofEntryDetailsProps {
  entry: MaloofEntry
  similarEntries: SimilarEntry[]
}

export function MaloofEntryDetails({ entry, similarEntries }: MaloofEntryDetailsProps) {
  console.log("MaloofEntryDetails received entry:", entry);
  const [isLiked, setIsLiked] = useState(entry.isLikedByUser)
  const [currentLikes, setCurrentLikes] = useState(entry.likes)
  const [comments, setComments] = useState<Comment[]>(entry.comments)
  const [newCommentText, setNewCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isTogglingLike, setIsTogglingLike] = useState(false)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(user);
      }
    };
    fetchUser();
  }, [supabase]);

  const handleLikeToggle = async () => {
    if (!user) {
      alert('Please log in to like items.');
      return;
    }

    if (isTogglingLike) return;
    setIsTogglingLike(true);

    const item_id = entry.id;
    const item_type = 'maloof';
    const user_id = user.id;

    if (isLiked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user_id)
        .eq('item_id', item_id)
        .eq('item_type', item_type);

      if (error) {
        console.error('Error unliking item:', error);
      } else {
        setIsLiked(false);
        setCurrentLikes(prev => prev - 1);
      }
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: user_id,
          item_id: item_id,
          item_type: item_type,
        });

      if (error) {
        console.error('Error liking item:', error);
      } else {
        setIsLiked(true);
        setCurrentLikes(prev => prev + 1);
      }
    }

    setIsTogglingLike(false);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
       alert('Please log in to post comments.');
       return;
     }

    if (!newCommentText.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    if (isSubmittingComment) return;
    setIsSubmittingComment(true);

    const item_id = entry.id;
    const item_type = 'maloof';
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
      .select();

    if (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment.');
    } else if (newComment && newComment.length > 0) {
      const addedComment: Comment = newComment[0];
      setComments(prevComments => [addedComment, ...prevComments]);
      setNewCommentText('');
    }

    setIsSubmittingComment(false);
  };

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/library" className="text-sm text-gray-400 hover:underline">
          Library
        </Link>
        <span className="text-gray-400">/</span>
        <Link href="/library?tab=maloof" className="text-sm text-gray-400 hover:underline">
          Maloof
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-sm font-medium">{entry.entryName}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="overflow-hidden rounded-lg border-2 border-white">
            <Image
              src={entry.entryImage || "/placeholder.svg"}
              alt={entry.entryName}
              width={400}
              height={400}
              className="w-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="mb-6 text-3xl font-bold">{entry.entryName}</h1>

          <div className="mb-8 overflow-hidden rounded-lg border border-white/30 bg-gray-900/30">
            <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
              <div className="p-4">
                <p className="text-sm text-gray-400">Entry Type</p>
                <p className="text-lg font-medium">{entry.entryType}</p>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-400">Rhythm</p>
                <p className="font-medium">{entry.entryRhythm}</p>
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
              <span>{typeof currentLikes === "number" ? currentLikes.toLocaleString() : "0"} Likes</span>
            </div>
          </div>

          <EnhancedTabs defaultValue="lyrics" className="w-full">
            <EnhancedTabsList className="w-full border border-white/50 flex">
              <EnhancedTabsTrigger value="lyrics" className="py-3 px-4 flex-1">
                Lyrics
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="notes" className="py-3 px-4 flex-1">
                Notes
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="comments" className="py-3 px-4 flex-1">
                Comments ({comments.length})
              </EnhancedTabsTrigger>
            </EnhancedTabsList>

            <EnhancedTabsContent value="lyrics" className="mt-4 rounded-lg border-2 border-white bg-gray-950 p-6">
              <div className="whitespace-pre-line text-right" dir="rtl">
                {entry.lyrics}
              </div>
            </EnhancedTabsContent>

            <EnhancedTabsContent value="notes" className="mt-4 rounded-lg border-2 border-white bg-gray-950 p-6">
              {entry.noteImage ? (
                <Image
                  src={entry.noteImage}
                  alt={`${entry.entryName} Notes`}
                  width={600}
                  height={400}
                  className="w-full object-contain"
                />
              ) : (
                <p className="text-gray-400">No note image available.</p>
              )}
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
                              <span className="font-medium">User ID: {comment.user_id}</span>
                              <span className="text-sm text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
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
                          placeholder="Share your thoughts about this entry..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          disabled={isSubmittingComment}
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-600 focus:outline-none"
                        disabled={isSubmittingComment}
                      >
                        {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </form>
                  ) : (
                    <p className="text-gray-400">Please log in to post a comment.</p>
                  )}
                </div>
              </div>
            </EnhancedTabsContent>
          </EnhancedTabs>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Similar Entries</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {similarEntries.slice(0, 4).map((similarEntry) => (
            <Link
              key={similarEntry.id}
              href={`/library/maloof/${similarEntry.id}`}
              className="group rounded-lg border-2 border-white bg-gray-950 p-4 transition-colors hover:border-white/40 flex flex-col items-center text-center"
            >
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md mb-2">
                <Image
                  src={similarEntry.image || "/placeholder.svg"}
                  alt={similarEntry.entryName}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 w-full">
                <h3 className="font-medium text-sm truncate group-hover:text-amber-500">{similarEntry.entryName}</h3>
                <p className="text-xs text-gray-400 truncate">{similarEntry.entryType}</p>
                <p className="text-xs text-gray-500 truncate">{similarEntry.entryRhythm}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 