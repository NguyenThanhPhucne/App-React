import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDarkMode, selectIsTransitioning, setTransitionComplete } from '../../../features/themeSlice';

const ThemeProvider = ({ children }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const isTransitioning = useSelector(selectIsTransitioning);
  const dispatch = useDispatch();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Prevent transition on initial load
    if (isInitialMount.current) {
      root.classList.add('theme-preload');
      body.classList.add('theme-preload');
      isInitialMount.current = false;
    }
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark');
    body.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    const themeClass = isDarkMode ? 'theme-dark' : 'theme-light';
    root.classList.add(themeClass);
    body.classList.add(themeClass);
    
    // Handle smooth transition
    if (isTransitioning && !isInitialMount.current) {
      // Remove preload class if present
      root.classList.remove('theme-preload');
      body.classList.remove('theme-preload');
      
      // Add transitioning class for smooth animation
      root.classList.add('theme-transitioning');
      body.classList.add('theme-transitioning');
      
      // Use RAF for smoother timing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Clean up after transition completes
          const timer = setTimeout(() => {
            root.classList.remove('theme-transitioning');
            body.classList.remove('theme-transitioning');
            dispatch(setTransitionComplete());
          }, 250); // Match CSS transition duration
          
          return () => clearTimeout(timer);
        });
      });
    } else if (!isTransitioning) {
      // Remove preload class after initial render
      setTimeout(() => {
        root.classList.remove('theme-preload');
        body.classList.remove('theme-preload');
      }, 100);
    }
  }, [isDarkMode, isTransitioning, dispatch]);

  return <>{children}</>;
};

export default ThemeProvider;
