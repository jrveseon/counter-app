import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CounterRow from './src/components/CounterRow';
import AddButton from './src/components/AddButton';
import { CounterItem } from './src/types';
import { loadItems, saveItems } from './src/utils/storage';

let idCounter = Date.now();
function generateId(): string {
  return `counter_${++idCounter}`;
}

export default function App() {
  const [items, setItems] = useState<CounterItem[]>([]);

  // Load saved data on mount
  useEffect(() => {
    loadItems().then((savedItems) => {
      if (savedItems.length > 0) {
        setItems(savedItems);
      }
    });
  }, []);

  // Auto-save whenever items change
  useEffect(() => {
    saveItems(items);
  }, [items]);

  const addItem = useCallback(() => {
    const newItem: CounterItem = {
      id: generateId(),
      name: '',
      count: 0,
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  const handleNameChange = useCallback((id: string, name: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item))
    );
  }, []);

  const handleIncrement = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );
  }, []);

  const handleDecrement = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, count: Math.max(0, item.count - 1) }
          : item
      )
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleCountEdit = useCallback((id: string, count: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, count } : item))
    );
  }, []);

  const renderItem = ({ item }: { item: CounterItem }) => (
    <CounterRow
      item={item}
      onNameChange={handleNameChange}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      onCountEdit={handleCountEdit}
      onDelete={handleDelete}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyText}>点击下方 + 按钮添加新的计数项</Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>计数器</Text>
          {items.length > 0 && (
            <Text style={styles.headerCount}>{items.length} 项</Text>
          )}
        </View>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={items.length === 0 ? styles.listEmpty : undefined}
          keyboardShouldPersistTaps="handled"
        />
        <View style={styles.footer}>
          <AddButton onPress={addItem} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 8,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerCount: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  listEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
});
