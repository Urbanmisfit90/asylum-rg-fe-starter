import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Profile.css';

export const Profile = () => {
  const { user, isLoading, error } = useAuth0();
  const [profileImage, setProfileImage] = useState('/default-profile.png');  // Default image

  useEffect(() => {
    if (user && user.picture) {
      // Attempt to load user's profile picture
      setProfileImage(user.picture);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  const fullName = `${user.given_name || ''} ${user.family_name || ''}`.trim() || user.name || 'N/A';
  const username = user.nickname || 'N/A';

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Current User Profile</h2>
        </div>
        <div className="card-body">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-4">
              <img
                src={profileImage}  // Always use the profileImage state
                alt="Profile"
                className="rounded-circle img-fluid mb-3"
                style={{ maxWidth: '200px' }}
                onError={() => setProfileImage('/default-profile.png')}  // Fallback if image fails to load
              />
            </div>
          </div>

          {/* Box container for Full Name and Username */}
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="info-box">
                <p><strong>Full Name:</strong> {fullName}</p>
                <p><strong>Username:</strong> {username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

