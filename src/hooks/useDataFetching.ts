import { useState, useEffect, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

interface FetchParams {
  page: number;
  pageSize: number;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export function useDataFetching<T>(
  supabase: SupabaseClient,
  table: string,
  initialFetchParams: FetchParams
) {
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchParams, setFetchParams] = useState(initialFetchParams);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select('*', { count: 'exact' });

      // Apply filters
      if (fetchParams.filters) {
        Object.entries(fetchParams.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.ilike(key, `%${value}%`);
          }
        });
      }

      // Apply sorting
      if (fetchParams.sortColumn) {
        query = query.order(fetchParams.sortColumn, {
          ascending: fetchParams.sortOrder === 'asc',
        });
      }

      // Apply pagination
      query = query.range(
        fetchParams.page * fetchParams.pageSize,
        (fetchParams.page + 1) * fetchParams.pageSize - 1
      );

      const { data, error, count } = await query;

      if (error) throw error;
      setData(data as T[]);
      setTotalCount(count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, table, fetchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFetchParams = useCallback((newParams: Partial<FetchParams>) => {
    setFetchParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  return { data, totalCount, loading, error, updateFetchParams, refetch: fetchData, fetchParams };
}