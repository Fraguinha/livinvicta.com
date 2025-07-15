import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Category } from '@/types/category';
import type { Project } from '@/types/project';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useFeaturedProjects() {
  return useQuery({
    queryKey: ['featuredProjects'],
    queryFn: () => apiFetch<Project[]>(API_ENDPOINTS.FEATURED_PROJECTS, { method: 'POST' }),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiFetch<Category[]>(API_ENDPOINTS.CATEGORIES, { method: 'POST', headers: { 'Content-Type': 'application/json' } }),
  });
}

export function useProjects(category: string) {
  return useQuery({
    queryKey: ['projects', category],
    queryFn: () => apiFetch<Project[]>(API_ENDPOINTS.PROJECTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    }),
    enabled: !!category,
  });
}

export function useProjectDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['projectDetail', id],
    queryFn: () => apiFetch<Project>(API_ENDPOINTS.PROJECT_DETAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }),
    enabled: !!id,
  });
}

export function useContactMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: any) => apiFetch(API_ENDPOINTS.CONTACT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
}
