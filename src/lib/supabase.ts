import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ServiceItem, TestimonialItem, LeadItem } from '../types';
import { SERVICES_LIST, TESTIMONIALS_LIST } from '../data/siteData';

// Storage keys for browser-configured fallback
const STORAGE_URL_KEY = 'sk_supabase_url';
const STORAGE_KEY_KEY = 'sk_supabase_anon_key';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return { url: envUrl.trim(), anonKey: envKey.trim() };
  }

  // Fallback to localStorage for testing or live config
  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem(STORAGE_URL_KEY) || '';
    const localKey = localStorage.getItem(STORAGE_KEY_KEY) || '';
    if (localUrl && localKey) {
      return { url: localUrl.trim(), anonKey: localKey.trim() };
    }
  }

  return { url: '', anonKey: '' };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http'));
}

export function saveLocalSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  }
}

export function clearLocalSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
  }
}

// Create client dynamically so it updates if credentials are provided in browser
let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseCredentials();

  if (cachedClient && url === lastUrl && anonKey === lastKey) {
    return cachedClient;
  }

  // Fallback dummy credentials if not yet set up
  const validUrl = isSupabaseConfigured() ? url : 'https://placeholder-project.supabase.co';
  const validKey = isSupabaseConfigured() ? anonKey : 'placeholder-anon-key';

  cachedClient = createClient(validUrl, validKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  lastUrl = url;
  lastKey = anonKey;
  return cachedClient;
}

export const supabase = getSupabaseClient();

// ============================================================
// DATA ACCESS HELPERS
// ============================================================

/**
 * Fetch services from Supabase "services" table.
 * Falls back to default SERVICES_LIST if not configured or empty.
 */
export async function fetchServices(): Promise<ServiceItem[]> {
  if (!isSupabaseConfigured()) {
    return SERVICES_LIST;
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('services')
      .select('*')
      .order('order', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase fetchServices error:', error.message);
      return SERVICES_LIST;
    }

    const mapped = data.map((item: any) => {
      let title = item.title;
      let description = item.description || '';
      let image = item.image_url || '/images/Security-Guards.webp';
      let order = item.order ?? 0;

      if (
        item.id === 'security-dog-services' ||
        item.id === 'eviction-bailiff-support-services' ||
        title === 'Security Dog Services'
      ) {
        title = 'Eviction and Bailiff Support Services';
        description =
          'Professional and compliant security support for land, property, and legal enforcement operations.';
        image = '/images/Eviction-Bailiff-Support.webp';
        order = -1;
      } else if (
        item.id === 'vacant-property-security-dogs' ||
        item.id === 'vacant-property-security' ||
        title === 'Vacant Property Security Dogs'
      ) {
        title = 'Vacant Property Security';
        if (!description || description.toLowerCase().includes('dog')) {
          description =
            'Proactive patrols safeguarding empty or disused buildings from trespassers, squatters, and damage.';
        }
        image = '/images/Vacant-Property-Security.jpg';
      }

      return {
        id: item.id === 'security-dog-services' ? 'eviction-bailiff-support-services' : item.id,
        title,
        description,
        image,
        icon: item.icon || 'Shield',
        order,
        is_active: item.is_active ?? true,
      };
    });

    mapped.sort((a, b) => a.order - b.order);
    return mapped;
  } catch (err) {
    console.error('Error fetching services:', err);
    return SERVICES_LIST;
  }
}

/**
 * Fetch testimonials from Supabase "testimonials" table.
 * Falls back to default TESTIMONIALS_LIST if not configured or empty.
 */
export async function fetchTestimonials(): Promise<TestimonialItem[]> {
  if (!isSupabaseConfigured()) {
    return TESTIMONIALS_LIST;
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase fetchTestimonials error:', error.message);
      return TESTIMONIALS_LIST;
    }

    return data.map((item: any) => ({
      id: String(item.id),
      author: item.name,
      quote: item.quote,
      image: item.image_url || '/images/Team-4.jpg',
      rating: item.rating || 5,
      role: item.role || 'Verified Client',
      created_at: item.created_at,
    }));
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    return TESTIMONIALS_LIST;
  }
}

/**
 * Insert a lead into the "leads" table.
 */
export async function submitLead(payload: {
  name: string;
  email: string;
  phone: string;
  service_interested: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Backend not configured yet. Please configure your Supabase credentials.',
    };
  }

  try {
    const client = getSupabaseClient();
    const { error } = await client.from('leads').insert([
      {
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        service_interested: payload.service_interested,
        message: payload.message.trim(),
        status: 'new',
      },
    ]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to submit enquiry' };
  }
}

/**
 * Fetch all leads (Admin only, newest first)
 */
export async function fetchLeads(): Promise<LeadItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: String(row.id),
      name: row.name,
      email: row.email,
      phone: row.phone || '',
      service_interested: row.service_interested || 'General Enquiry',
      message: row.message || '',
      status: row.status === 'contacted' ? 'contacted' : 'new',
      created_at: row.created_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.error('Error fetching leads:', err);
    throw err;
  }
}

/**
 * Update lead status (e.g. mark contacted)
 */
export async function updateLeadStatus(id: string, status: 'new' | 'contacted'): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('Backend not configured yet');
  }

  const client = getSupabaseClient();
  const { error } = await client
    .from('leads')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Delete a lead
 */
export async function deleteLead(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('Backend not configured yet');
  }

  const client = getSupabaseClient();
  const { error } = await client
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Add or update service
 */
export async function saveService(service: {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  order?: number;
  is_active?: boolean;
}): Promise<void> {
  const client = getSupabaseClient();
  const serviceId = service.id || service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const { error } = await client.from('services').upsert({
    id: serviceId,
    title: service.title,
    description: service.description,
    icon: service.icon || 'Shield',
    image_url: service.image_url || '/images/Security-Guards.webp',
    order: service.order ?? 0,
    is_active: service.is_active ?? true,
  });

  if (error) throw error;
}

/**
 * Delete a service
 */
export async function deleteService(id: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from('services').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Add or update testimonial
 */
export async function saveTestimonial(testimonial: {
  id?: string;
  name: string;
  quote: string;
  rating?: number;
  role?: string;
  image_url?: string;
}): Promise<void> {
  const client = getSupabaseClient();
  const payload: any = {
    name: testimonial.name,
    quote: testimonial.quote,
    rating: testimonial.rating || 5,
    role: testimonial.role || 'Client',
    image_url: testimonial.image_url || '/images/Team-4.jpg',
  };

  if (testimonial.id) {
    payload.id = testimonial.id;
  }

  const { error } = await client.from('testimonials').upsert(payload);
  if (error) throw error;
}

/**
 * Delete a testimonial
 */
export async function deleteTestimonial(id: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}
