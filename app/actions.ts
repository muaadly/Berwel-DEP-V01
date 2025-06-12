'use server';

import { createClient } from '@/utils/supabase/server'; // Import server-side client
import { revalidatePath } from 'next/cache';

export async function toggleLikeAction(itemId: string, userId: string, isLiked: boolean) {
  const supabase = await createClient(); // Create server-side client

  console.log("[Server Action] toggleLikeAction called:", { itemId, userId, isLiked });

  try {
    if (isLiked) {
      // Unlike the item using the stored procedure
      console.log('[Server Action] Attempting to unlike item via RPC:', { userId, itemId });
      const { data: rpcData, error: unlikeError } = await supabase
        .rpc('unlike_item', {
          p_user_id: userId,
          p_item_id: itemId,
          p_item_type: 'song' // Assuming item_type is always 'song' for this action
        });

      if (unlikeError) {
        console.error('[Server Action] Error unliking item via RPC:', unlikeError);
        return { success: false, error: unlikeError.message };
      }

      console.log('[Server Action] Unlike successful. RPC Data:', rpcData);
      revalidatePath(`/library/libyan-songs/${itemId}`);
      return { success: true };

    } else {
      // Like the item using the stored procedure
      console.log('[Server Action] Attempting to like item via RPC:', { userId, itemId });
      const { data: rpcData, error: likeError } = await supabase
        .rpc('like_item', {
          p_user_id: userId,
          p_item_id: itemId,
          p_item_type: 'song' // Assuming item_type is always 'song' for this action
        });

      if (likeError) {
        console.error('[Server Action] Error liking item via RPC:', likeError);
        return { success: false, error: likeError.message };
      }

      console.log('[Server Action] Like successful. RPC Data:', rpcData);
      revalidatePath(`/library/libyan-songs/${itemId}`);
      return { success: true };
    }
  } catch (catchError: any) {
    console.error('[Server Action] Unexpected error:', catchError);
    return { success: false, error: catchError.message || 'An unexpected error occurred.' };
  }
}

// You might add other server actions here later 