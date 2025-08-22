
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-6 py-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Minka. All rights reserved.</p>
      </div>
    </footer>
  );
};