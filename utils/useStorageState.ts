import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync<T>(key: string, value: T | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value)); // Stringify for storage
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, JSON.stringify(value)); // Stringify for storage
    }
  }
}

export function useStorageState<T>(key: string): UseStateHook<T> {
    const [state, setState] = useAsyncState<T>();
  
    useEffect(() => {
      const getStorageItemAsync = async () => {
        try {
          let value: string | null = null;
  
          if (Platform.OS === 'web') {
            if (typeof localStorage !== 'undefined') {
              value = localStorage.getItem(key);
            }
          } else {
            value = await SecureStore.getItemAsync(key);
          }
  
          if (value) {
            setState(JSON.parse(value) as T); // Explicitly assert the type
          } else {
            setState(null);
          }
        } catch (e) {
          console.error(`Error loading ${key}:`, e);
        }
      };
  
      getStorageItemAsync();
    }, [key]);
  
    const setValue = useCallback(
      (value: T | null) => {
        setState(value);
        setStorageItemAsync(key, value); // Stringify before saving
      },
      [key]
    );
  
    return [state, setValue];
}
  