import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Modal,
  Keyboard,
  Platform,
  Dimensions,
} from 'react-native';
import { CounterItem } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 80;

interface CounterRowProps {
  item: CounterItem;
  onNameChange: (id: string, name: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onCountEdit: (id: string, count: number) => void;
  onDelete: (id: string) => void;
}

export default function CounterRow({
  item,
  onNameChange,
  onIncrement,
  onDecrement,
  onCountEdit,
  onDelete,
}: CounterRowProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showCountModal, setShowCountModal] = useState(false);
  const [countInput, setCountInput] = useState(String(item.count));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        // Only respond to horizontal swipes
        return Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy);
      },
      onPanResponderGrant: () => {
        translateX.setOffset(0);
        translateX.setValue(0);
      },
      onPanResponderMove: (_, gesture) => {
        // Only allow swiping left (negative dx)
        if (gesture.dx < 0) {
          translateX.setValue(Math.max(gesture.dx, -SWIPE_THRESHOLD));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        translateX.flattenOffset();
        if (gesture.dx < -50) {
          // Show delete button
          Animated.spring(translateX, {
            toValue: -SWIPE_THRESHOLD,
            useNativeDriver: true,
          }).start();
          setShowDeleteButton(true);
        } else {
          // Snap back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setShowDeleteButton(false);
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        setShowDeleteButton(false);
      },
    })
  ).current;

  const handleDelete = useCallback(() => {
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onDelete(item.id);
    });
  }, [item.id, onDelete, translateX]);

  const handleCountPress = useCallback(() => {
    setCountInput(String(item.count));
    setShowCountModal(true);
  }, [item.count]);

  const handleCountSave = useCallback(() => {
    const num = parseInt(countInput, 10);
    if (!isNaN(num) && num >= 0) {
      onCountEdit(item.id, num);
    }
    setShowCountModal(false);
    Keyboard.dismiss();
  }, [countInput, item.id, onCountEdit]);

  return (
    <View style={styles.wrapper}>
      {/* Delete background visible on swipe */}
      <View style={styles.deleteBackground}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>删除</Text>
        </TouchableOpacity>
      </View>

      {/* Main row with animated translate */}
      <Animated.View
        style={[styles.container, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <TextInput
          style={styles.nameInput}
          placeholder="输入计数项"
          placeholderTextColor="#C7C7CD"
          value={item.name}
          onChangeText={(text) => onNameChange(item.id, text)}
          clearButtonMode="while-editing"
        />
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onDecrement(item.id)}
          >
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.countContainer} onPress={handleCountPress}>
            <Text style={styles.countText}>{item.count}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.plusButton]}
            onPress={() => onIncrement(item.id)}
          >
            <Text style={[styles.buttonText, styles.plusButtonText]}>+</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Count edit modal */}
      <Modal
        visible={showCountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCountModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCountModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>编辑数字</Text>
            <TextInput
              style={styles.modalInput}
              value={countInput}
              onChangeText={setCountInput}
              keyboardType="number-pad"
              autoFocus
              selectTextOnFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowCountModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={handleCountSave}
              >
                <Text style={styles.modalBtnConfirmText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SWIPE_THRESHOLD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: SWIPE_THRESHOLD,
    height: '100%',
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    paddingVertical: 4,
    marginRight: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  plusButtonText: {
    color: '#FFFFFF',
  },
  countContainer: {
    minWidth: 46,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  countText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    width: 260,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingVertical: 8,
    marginBottom: 20,
    color: '#1C1C1E',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#F2F2F7',
  },
  modalBtnCancelText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '600',
  },
  modalBtnConfirm: {
    backgroundColor: '#007AFF',
  },
  modalBtnConfirmText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
