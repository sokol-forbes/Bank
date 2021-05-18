import { useState, useCallback } from 'react';

const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, method = 'GET', body = null, headers = { }, isFormData = false) => {
    setLoading(true);

    try {
      if (body && !isFormData) {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch(url, { method, body, headers });
      const data = await res.json();

      if (!res.ok) {
        throw { message: data.message || 'Что-то пошло не так', errors: data.errors };
      }

      setLoading(false);

      return data;
    } catch (e) {
      setLoading(false);
      setError(e.message);
      throw e;
    }
  }, []);

  const clearError = () => setError(null);

  return { loading, request, error, clearError };
};

export default useHttp;