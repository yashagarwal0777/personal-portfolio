import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'Yash.Agrawal0220@gmail.com';
const configuredAdminUsername = import.meta.env.VITE_ADMIN_USERNAME || 'yash';

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));
};

// Initialize Supabase client (only create real client if configured, else dummy fallback)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Helper to resolve admin username/ID or email into the Supabase Auth email
export const resolveAdminEmail = (idOrEmail) => {
  if (!idOrEmail) return '';
  const trimmed = idOrEmail.trim();
  if (trimmed.includes('@')) {
    return trimmed;
  }
  // If user entered username (e.g. 'yash' or 'admin')
  return configuredAdminEmail;
};

// Authentication services
export const authService = {
  async signIn(idOrEmail, password) {
    if (!isSupabaseConfigured()) {
      throw new Error(
        'Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.'
      );
    }
    const email = resolveAdminEmail(idOrEmail);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    return data;
  },

  async signOut() {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data?.session || null;
  },

  async getUser() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data?.user || null;
  },

  async updatePassword(newPassword) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Storage upload service
export const storageService = {
  async uploadFile(file, folder = 'uploads') {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${folder}/${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from('portfolio-assets')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },
};

// Database CRUD services
export const dbService = {
  // Profile
  async getProfile() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'main')
      .single();
    if (error) {
      console.warn('Could not fetch profiles from Supabase:', error.message);
      return null;
    }
    return data;
  },

  async updateProfile(updates) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: 'main', ...updates, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Site Settings
  async getSettings() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'config')
      .single();
    if (error) return null;
    return data;
  },

  async updateSettings(updates) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ id: 'config', ...updates, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Projects CRUD
  async getProjects() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) return null;
    return data;
  },

  async addProject(project) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(id, updates) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProject(id) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  // Experiences CRUD
  async getExperiences() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) return null;
    return data;
  },

  async addExperience(exp) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('experiences')
      .insert([exp])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateExperience(id, updates) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('experiences')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteExperience(id) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw error;
  },

  // Education CRUD
  async getEducation() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) return null;
    return data;
  },

  async addEducation(edu) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('education')
      .insert([edu])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateEducation(id, updates) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('education')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteEducation(id) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) throw error;
  },

  // Skills CRUD
  async getSkills() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) return null;
    return data;
  },

  async addSkill(skill) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateSkill(id, updates) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('skills')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteSkill(id) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  },

  // Certifications CRUD
  async getCertifications() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) return null;
    return data;
  },

  async addCertification(cert) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('certifications')
      .insert([cert])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCertification(id, updates) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('certifications')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCertification(id) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (error) throw error;
  },

  // Hobbies CRUD
  async getHobbies() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('hobbies')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) return null;
    return data;
  },

  async addHobby(hobby) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('hobbies')
      .insert([hobby])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateHobby(id, updates) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { data, error } = await supabase
      .from('hobbies')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteHobby(id) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { error } = await supabase.from('hobbies').delete().eq('id', id);
    if (error) throw error;
  },

  // Contact Messages
  async submitContactMessage(msg) {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, simulating contact message send:', msg);
      return { success: true };
    }
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([msg])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getContactMessages() {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async deleteContactMessage(id) {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
  },
};
