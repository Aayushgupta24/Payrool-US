import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Oops!</h1>
        <p className="mb-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-600 mb-4">
          {(error as any)?.statusText || (error as any)?.message}
        </p>
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Go back to login
        </Link>
      </div>
    </div>
  );
}