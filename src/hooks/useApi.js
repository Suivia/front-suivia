import { useState, useEffect, useCallback } from "react";

export function useApi(fn, fallback = null, deps = []) {
  const [data,    setData]    = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fn();
      setData(Array.isArray(r?.data) ? r.data : r?.data ?? fallback);
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "API error");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load, setData };
}
