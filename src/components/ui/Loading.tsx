"use client";

import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  height?: string;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium', 
  height = 'h-64', 
  color = 'border-orange-500' 
}) => {
  const sizeMap = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className={`flex justify-center items-center ${height}`}>
      <div className={`animate-spin rounded-full ${sizeMap[size]} border-b-2 ${color}`}></div>
    </div>
  );
};

export default Loading;