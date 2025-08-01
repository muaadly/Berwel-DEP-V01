'use server';

import { createClient } from '@/utils/supabase/server'; // Import server-side client
import { revalidatePath } from 'next/cache';

export async function toggleLikeAction(itemId: string, userId: string, isLiked: boolean) {
  console.log("[Server Action] toggleLikeAction called with:", { 
    itemId, 
    userId, 
    isLiked,
    types: {
      itemIdType: typeof itemId,
      userIdType: typeof userId
    }
  });

  try {
    const supabase = await createClient();
    console.log("[Server Action] Supabase client created successfully");

    if (isLiked) {
      // Unlike the item using the stored procedure
      console.log('[Server Action] Attempting to unlike item via RPC:', { 
        userId, 
        itemId,
        types: {
          userIdType: typeof userId,
          itemIdType: typeof itemId
        }
      });
      
      const { error: unlikeError } = await supabase
        .rpc('unlike_item', {
          p_user_id: userId,
          p_item_id: itemId,
          p_item_type: 'song'
        });

      if (unlikeError) {
        console.error('[Server Action] Error unliking item via RPC:', unlikeError);
        return { success: false, error: unlikeError.message };
      }

      console.log('[Server Action] Unlike successful');
      revalidatePath(`/library/libyan-songs/${itemId}`);
      return { success: true };

    } else {
      // Like the item using the stored procedure
      console.log('[Server Action] Attempting to like item via RPC:', { 
        userId, 
        itemId,
        types: {
          userIdType: typeof userId,
          itemIdType: typeof itemId
        }
      });
      
      const { error: likeError } = await supabase
        .rpc('like_item', {
          p_user_id: userId,
          p_item_id: itemId,
          p_item_type: 'song'
        });

      if (likeError) {
        console.error('[Server Action] Error liking item via RPC:', likeError);
        return { success: false, error: likeError.message };
      }

      console.log('[Server Action] Like successful');
      revalidatePath(`/library/libyan-songs/${itemId}`);
      return { success: true };
    }
  } catch (error: any) {
    console.error('[Server Action] Unexpected error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

// You might add other server actions here later 