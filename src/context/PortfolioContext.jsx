import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { portfolioData as initialData, socialLinks as initialSocialLinks } from '../data/portfolioData';
import { supabase, isSupabaseConfigured, authService, dbService } from '../lib/supabase';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(initialData);
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Authentication state watcher
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured()) {
        setIsLoadingAuth(false);
        return;
      }

      try {
        const currentSession = await authService.getSession();
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          setIsLoadingAuth(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) setIsLoadingAuth(false);
      }

      const { data: authListener } = authService.onAuthStateChange((_event, newSession) => {
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user || null);
        }
      });

      return () => {
        mounted = false;
        authListener?.subscription?.unsubscribe();
      };
    }

    initAuth();
  }, []);

  // Fetch live portfolio data from Supabase
  const loadSupabaseData = useCallback(async () => {
    if (!isSupabaseConfigured()) return;

    setIsLoadingData(true);
    try {
      const [
        profileRes,
        projectsRes,
        expRes,
        eduRes,
        skillsRes,
        certsRes,
        hobbiesRes,
        settingsRes,
      ] = await Promise.allSettled([
        dbService.getProfile(),
        dbService.getProjects(),
        dbService.getExperiences(),
        dbService.getEducation(),
        dbService.getSkills(),
        dbService.getCertifications(),
        dbService.getHobbies(),
        dbService.getSettings(),
      ]);

      const profile = profileRes.status === 'fulfilled' ? profileRes.value : null;
      const projects = projectsRes.status === 'fulfilled' ? projectsRes.value : null;
      const experiences = expRes.status === 'fulfilled' ? expRes.value : null;
      const education = eduRes.status === 'fulfilled' ? eduRes.value : null;
      const skills = skillsRes.status === 'fulfilled' ? skillsRes.value : null;
      const certs = certsRes.status === 'fulfilled' ? certsRes.value : null;
      const hobbies = hobbiesRes.status === 'fulfilled' ? hobbiesRes.value : null;
      const settings = settingsRes.status === 'fulfilled' ? settingsRes.value : null;

      setData((prev) => {
        const next = { ...prev };

        // Profile merge
        if (profile) {
          next.profile = {
            ...next.profile,
            name: profile.name || next.profile.name,
            role: profile.role || next.profile.role,
            location: profile.location || next.profile.location,
            status: profile.status || next.profile.status,
            bio: profile.bio || next.profile.bio,
            email: profile.email || next.profile.email,
            phone: profile.phone || next.profile.phone,
            whatsapp: profile.whatsapp || next.profile.whatsapp,
            linkedin: profile.linkedin || next.profile.linkedin,
            github: profile.github || next.profile.github,
            githubRepo: profile.github_repo || next.profile.githubRepo,
            resumeUrl: profile.resume_url || next.profile.resumeUrl,
            stats: Array.isArray(profile.hero_stats) ? profile.hero_stats : next.profile.stats,
          };

          if (next.about) {
            next.about = {
              ...next.about,
              lede: profile.about_lede || next.about.lede,
              doing: Array.isArray(profile.doing_list) ? profile.doing_list : next.about.doing,
              facts: Array.isArray(profile.facts) ? profile.facts : next.about.facts,
              storyTitle: profile.story_title || next.about.storyTitle,
              story: profile.story || next.about.story,
              motto: profile.motto || next.about.motto,
              mottoNote: profile.motto_note || next.about.mottoNote,
            };
          }

          if (next.contact) {
            next.contact.email = profile.email || next.contact.email;
            next.contact.whatsapp = profile.whatsapp || next.contact.whatsapp;
          }
        }

        // Projects merge
        if (projects && projects.length > 0) {
          next.experience.projects = projects.map((p) => ({
            id: p.id,
            rank: p.rank || 'S',
            title: p.title,
            desc: p.description,
            githubUrl: p.github_url,
            demoUrl: p.demo_url,
            tags: (p.tags || []).map((t, idx) => ({ id: `pt_${idx}`, label: t })),
          }));
        }

        // Experiences merge
        if (experiences && experiences.length > 0) {
          next.experience.jobs = experiences.map((e) => ({
            id: e.id,
            title: e.title,
            company: e.company,
            location: e.location,
            period: e.period,
            state: e.state,
            bullets: (e.bullets || []).map((b, idx) => ({ id: `eb_${idx}`, text: b })),
            loot: e.loot,
          }));
        }

        // Education merge
        if (education && education.length > 0) {
          next.education.entries = education.map((ed) => ({
            id: ed.id,
            degree: ed.degree,
            school: ed.school,
            period: ed.period,
            state: ed.state || 'complete',
            note: ed.note,
          }));
        }

        // Skills merge
        if (skills && skills.length > 0) {
          next.skills.bars = skills.map((s) => ({
            id: s.id,
            name: s.name,
            value: s.proficiency,
          }));
        }

        // Certifications merge
        if (certs && certs.length > 0) {
          next.certifications.items = certs.map((c) => ({
            id: c.id,
            icon: c.icon || '★',
            title: c.title,
            issuer: c.issuer,
            kind: c.kind,
            desc: c.description,
            tags: (c.tags || []).map((t, idx) => ({ id: `ct_${idx}`, label: t })),
          }));
        }

        // Hobbies merge
        if (hobbies && hobbies.length > 0) {
          next.hobbies.items = hobbies.map((h) => ({
            id: h.id,
            icon: h.icon || '⚡',
            name: h.name,
            desc: h.description,
          }));
        }

        // Settings / Social links merge
        if (settings) {
          if (settings.social_links) {
            setSocialLinks(settings.social_links);
            if (settings.social_links.linkedin) {
              next.profile.linkedin = settings.social_links.linkedin;
            }
            if (settings.social_links.github) {
              next.profile.github = `https://github.com/${settings.social_links.github}`;
            }
          }
          if (settings.active_resume_url) {
            next.profile.resumeUrl = settings.active_resume_url;
          }
        }

        return next;
      });
    } catch (err) {
      console.warn('Error loading Supabase portfolio data, keeping local defaults:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadSupabaseData();
  }, [loadSupabaseData]);

  const login = async (idOrEmail, password) => {
    const res = await authService.signIn(idOrEmail, password);
    setSession(res.session);
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    await authService.signOut();
    setSession(null);
    setUser(null);
  };

  const value = {
    portfolioData: data,
    socialLinks,
    user,
    session,
    isAuthenticated: Boolean(session?.user),
    isLoadingAuth,
    isLoadingData,
    isSupabaseConfigured: isSupabaseConfigured(),
    login,
    logout,
    refetchPortfolioData: loadSupabaseData,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return ctx;
}
