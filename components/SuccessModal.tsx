import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SuccessModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ visible, message, onClose }) => {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Auto-close after 2 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount or modal close
    }
  }, [visible, onClose]);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
          <Text style={styles.successMessage}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  successMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 12,
    textAlign: 'center',
  },
});
