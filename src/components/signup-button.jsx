import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();
  const handleSignUp = async () => {
    await loginWithRedirect({
        appState: {
            returnTo: '/protected/profile'
        },
        authorizationParams: {
            screen_hint: 'signup'
        }
    });
  };

  return (
    <button
      className="btn btn-primary btn-block"
      onClick={handleSignUp}
    >
      Sign Up
    </button>
  );
};

export default SignupButton;