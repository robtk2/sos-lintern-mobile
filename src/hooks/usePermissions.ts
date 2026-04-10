import { useState, useCallback, useEffect } from 'react';
import { FlashlightService } from '@services/FlashlightService';

/**
 * Hook to manage camera/flashlight permission state.
 */
export const usePermissions = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermissions = useCallback(async () => {
    const granted = await FlashlightService.requestPermissions();
    setHasPermission(granted);
    return granted;
  }, []);

  // Initial check on mount
  useEffect(() => {
    FlashlightService.requestPermissions().then(setHasPermission);
  }, []);

  return {
    hasPermission,
    setHasPermission,
    requestPermissions
  };
};
