import AsyncStorage from '@react-native-async-storage/async-storage';
import { CounterItem } from '../types';

const STORAGE_KEY = '@counter_app_items';

export async function loadItems(): Promise<CounterItem[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json !== null) {
      return JSON.parse(json);
    }
    return [];
  } catch (e) {
    console.error('Failed to load items:', e);
    return [];
  }
}

export async function saveItems(items: CounterItem[]): Promise<void> {
  try {
    const json = JSON.stringify(items);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    console.error('Failed to save items:', e);
  }
}
