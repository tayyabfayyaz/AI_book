import React, { useEffect } from 'react';
import { useLocation, Redirect } from '@docusaurus/router';
import { useAuth } from 'better-auth/client';

function Root({ children }) {
  const { pathname } = useLocation();
  const { isAuthenticated, isLoading } = useAuth(); // Get auth state from better-auth

  // Define protected routes for Docusaurus
  const protectedDocusaurusRoutes = ['/book/docs/intro', '/book/docs/tutorial-basics/create-a-document']; // Example protected routes

  // Check if the current route is protected and if the user is not authenticated
  if (!isLoading && !isAuthenticated && protectedDocusaurusRoutes.includes(pathname)) {
    // Redirect to the Next.js sign-in page
    // Note: This assumes Next.js is running on the same domain/port as Docusaurus,
    // or you'll need to specify the full URL to the Next.js app.
    return <Redirect to="/auth/signin" />;
  }

  return <>{children}</>;
}

export default Root;
