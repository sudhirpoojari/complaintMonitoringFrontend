import React, { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/register';
  }, []);

  return null;
}
