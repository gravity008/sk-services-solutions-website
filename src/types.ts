export type PageTab = 'home' | 'about' | 'services' | 'contact' | 'admin-login' | 'admin-dashboard';

export interface ServiceItem {
  id: string;
  title: string;
  image?: string;
  image_url?: string;
  description: string;
  icon?: string;
  order?: number;
  is_active?: boolean;
}

export interface TestimonialItem {
  id: string;
  author: string;
  quote: string;
  image?: string;
  role?: string;
  rating?: number;
  created_at?: string;
}

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_interested: string;
  message: string;
  status: 'new' | 'contacted';
  created_at: string;
}

export interface SectorItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

