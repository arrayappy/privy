import { useState, useEffect } from 'react';
import useDimensions from "src/hooks/useDimensions";

function getWindowDimensions() {
  // Check if window is defined (client-side)
  if (typeof window !== 'undefined') {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      height,
      width,
    };
  }
  // Return default values for server-side rendering
  return {
    height: 0,
    width: 0,
  };
}

export default function useWindowDimensions() {
  return useDimensions(getWindowDimensions);
}
