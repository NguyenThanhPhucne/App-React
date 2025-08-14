import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme, selectIsDarkMode, selectIsTransitioning } from '../features/themeSlice';

export const useTheme = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const isTransitioning = useSelector(selectIsTransitioning);
  const dispatch = useDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleSetTheme = (isDark) => {
    dispatch(setTheme(isDark));
  };

  return {
    isDarkMode,
    isTransitioning,
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
    themeClass: isDarkMode ? 'theme-dark' : 'theme-light',
  };
};

export default useTheme;
