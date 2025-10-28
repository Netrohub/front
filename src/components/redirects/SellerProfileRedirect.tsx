import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

/**
 * Redirects old /seller/:seller routes to new /@:username routes
 * This maintains backward compatibility with old seller profile links
 */
const SellerProfileRedirect = () => {
  const { seller } = useParams<{ seller: string }>();

  // If no seller param, redirect to home
  if (!seller) {
    return <Navigate to="/" replace />;
  }

  // Redirect to new unified profile route
  return <Navigate to={`/@${seller}`} replace />;
};

export default SellerProfileRedirect;

