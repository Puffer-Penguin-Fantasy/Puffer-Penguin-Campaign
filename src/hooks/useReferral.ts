import { useEffect } from 'react';

export function useReferral() {
  useEffect(() => {
    // Check if there is a ?ref= parameter in the URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');

    if (ref && typeof ref === 'string') {
      // Store the referrer wallet address in local storage
      localStorage.setItem('arctic_referrer', ref);

      // Clean up the URL (remove the ?ref parameter without refreshing the page)
      const url = new URL(window.location.href);
      url.searchParams.delete('ref');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const getSavedReferrer = () => {
    return localStorage.getItem('arctic_referrer');
  };

  const clearReferrer = () => {
    localStorage.removeItem('arctic_referrer');
  };

  return { getSavedReferrer, clearReferrer };
}
