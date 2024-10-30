import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthenticationButton = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      redirectUri: window.location.origin
    });
  };

  const handleLogout = () => {
    logout({
      returnTo: window.location.origin
    });
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default AuthenticationButton;
