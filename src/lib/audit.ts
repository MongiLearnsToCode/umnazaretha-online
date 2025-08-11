import { supabase } from '@/lib/supabase';
import { Json } from '@/types/supabase';

export async function logAdminAction(
  action: string,
  resource_type: string,
  user_id: string,
  resource_id?: string,
  details?: Json
) {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        action,
        resource_type,
        resource_id: resource_id || null,
        user_id,
        details: details || null,
      });

    if (error) {
      console.warn('Failed to log admin action:', error.message);
    }
  } catch (error) {
    console.warn('Error logging admin action:', error);
  }
}