import React, { useState, useEffect } from 'react';

// handle apiCall to backend : sample => to be modified
// sample usage in pages: const apiData = { email, password };
// const apiResponse = await apiCall('POST', 'user/auth/login', apiData);
// => response = json object => check things like apiResponse.error
export const apiCall = async (method: string, path: string, body: object, authed = false, signal?: AbortSignal) => {
  const header = new Headers();
  const token = localStorage.getItem('token');

  header.set('Content-type', 'application/json');
  if (authed) {
    header.set('Authorization', `Bearer ${token}`);
  }

  const requestBody: BodyInit | null = method !== 'GET' ? JSON.stringify(body) : null;

  let response;

  // change port number below accordingly
  response = await fetch(`http://localhost:5555/${path}`, {
    method,
    body: requestBody,
    headers: header,
    signal
  });

  return await response?.json();
};

// Function to handle image uploads to profile image.
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result); // Base64 string
      } else {
        reject(new Error('Failed to convert file to Base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

// Helper function for mobile responsiveness, to return the current dimensions
// To decide whether mobile or tablet or desktop version for pages and components
export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export const Mobile = 600;
export const Tablet = 750;

