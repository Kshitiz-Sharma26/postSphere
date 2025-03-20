import { useState } from "react";

const useApiCall = (api: Function) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchData(options: Record<string, any>) {
    setLoading(true);
    try {
      const resp = await api(options);
      if (resp) setData(resp.data);
    } catch (err: any) {
      if (err.message) setError(err.message);
      else setError("An unknown error occured");
    } finally {
      setLoading(false);
    }
  }
  return [fetchData, loading, data, error];
};

export default useApiCall;
