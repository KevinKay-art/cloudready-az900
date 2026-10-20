import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'cloudready_supabase_url';
const STORAGE_KEY_KEY = 'cloudready_supabase_key';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  // Check localStorage first (user manual input in UI), then Vite environment variables
  const storedUrl = localStorage.getItem(STORAGE_KEY_URL);
  const storedKey = localStorage.getItem(STORAGE_KEY_KEY);

  const envUrl = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || '';

  const url = storedUrl || envUrl || '';
  const anonKey = storedKey || envKey || '';

  return { url, anonKey };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (url.trim()) {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_URL);
  }

  if (anonKey.trim()) {
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_KEY);
  }

  // Reset client instance
  clientInstance = null;
}

export function clearSupabaseCredentials(): void {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_KEY);
  clientInstance = null;
}

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (clientInstance) return clientInstance;

  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey || url.includes('your-project-id') || anonKey.includes('your-anon-public-key')) {
    return null;
  }

  try {
    clientInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return clientInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  if (!url || !anonKey) {
    return { success: false, message: 'Please provide both Project URL and Anon Public Key.' };
  }

  try {
    const testClient = createClient(url, anonKey);
    // Ping auth or public table
    const { error } = await testClient.from('study_progress').select('id').limit(1);

    // If table doesn't exist yet, we still know connection to supabase works if error is not network error
    if (error && error.code === '42P01') {
      return {
        success: true,
        message: 'Connected to Supabase! (Note: Tables are not created yet. Run the SQL setup script in the Supabase SQL editor).',
      };
    }

    if (error && (error.message.includes('FetchError') || error.message.includes('Failed to fetch') || error.code === 'PGRST301')) {
      return { success: false, message: `Connection failed: ${error.message}` };
    }

    return { success: true, message: 'Successfully connected and verified Supabase database!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown connection error';
    return { success: false, message: `Failed to connect: ${msg}` };
  }
}

export async function getCurrentSupabaseUser(): Promise<User | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data } = await client.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
}
