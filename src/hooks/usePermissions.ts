import { useState, useCallback, useEffect } from 'react';
import { FlashlightService } from '@services/FlashlightService';
import { LocationService } from '@services/LocationService';

export interface PermissionState {
  camera: boolean | null;
  location: boolean | null;
}

/**
 * Hook to manage unified hardware permissions (Camera & Location).
 */
export const usePermissions = () => {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: null,
    location: null,
  });

  const requestPermissions = useCallback(async () => {
    const cameraGranted = await FlashlightService.requestPermissions();
    const locationGranted = await LocationService.requestPermissions();
    
    setPermissions({
      camera: cameraGranted,
      location: locationGranted,
    });

    return cameraGranted && locationGranted;
  }, []);

  // Initial check on mount
  useEffect(() => {
    const checkAll = async () => {
      const camera = await FlashlightService.requestPermissions();
      const location = await LocationService.requestPermissions();
      setPermissions({ camera, location });
    };
    checkAll();
  }, []);

  return {
    permissions,
    requestPermissions
  };
};
