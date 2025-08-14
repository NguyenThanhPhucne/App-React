import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDarkMode, selectIsTransitioning, setTransitionComplete } from '../../../features/themeSlice';

const ThemeProvider = ({ children }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const isTransitioning = useSelector(selectIsTransitioning);
  const dispatch = useDispatch();

  useEffect(() => {
    // Apply theme class to root element
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark');
    body.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    const themeClass = isDarkMode ? 'theme-dark' : 'theme-light';
    root.classList.add(themeClass);
    body.classList.add(themeClass);
    
    // Add transitioning class for smooth transition
    if (isTransitioning) {
      root.classList.add('theme-transitioning');
      body.classList.add('theme-transitioning');
      
      // Remove transitioning class after animation
      const timer = setTimeout(() => {
        root.classList.remove('theme-transitioning');
        body.classList.remove('theme-transitioning');
        dispatch(setTransitionComplete());
      }, 300); // Match CSS transition duration
      
      return () => clearTimeout(timer);
    }
  }, [isDarkMode, isTransitioning, dispatch]);

  return <>{children}</>;
};

export default ThemeProvider;
