import { useState } from "react";

const useApiCall = <T,>(
  api: (options?: Record<string, unknown>) => Promise<{
    data?: T;
    message?: string;
  }>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchData(options?: Record<string, unknown>) {
    setLoading(true);
    try {
      const resp = await api(options);
      if (resp.data) setData(resp.data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occured");
    } finally {
      setLoading(false);
    }
  }
  return { fetchData, loading, data, error };
};

export default useApiCall;
