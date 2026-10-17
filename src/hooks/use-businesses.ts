'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBusinesses, fetchBusiness, fetchAllWithMeta } from '@/lib/api-client';
import type { SearchParams } from '@/lib/business-logic';
import type { Business } from '@/data/businesses';

export function useBusinesses(p: SearchParams) {
  return useQuery<Business[]>({
    queryKey: ['businesses', p],
    queryFn: () => fetchBusinesses(p),
    staleTime: 30_000,
  });
}

export function useBusiness(slug?: string | null, coords?: { lat: number; lng: number }) {
  return useQuery<Business | null>({
    queryKey: ['business', slug, coords?.lat, coords?.lng],
    queryFn: () => fetchBusiness(slug!, coords),
    enabled: !!slug,
    staleTime: 30_000,
  });
}

export function useAllBusinesses(coords?: { lat: number; lng: number }) {
  return useQuery<Business[]>({
    queryKey: ['all-businesses', coords?.lat, coords?.lng],
    queryFn: () => fetchAllWithMeta(coords),
    staleTime: 30_000,
  });
}
