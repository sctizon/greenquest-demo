import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons

interface SignUpModalProps {
  visible: boolean;
  eventName: string;
  userData: { name: string ; email: string }; // Pass user data
  onClose: () => void; // Function to close the modal
  onSubmit: () => void; // Function to handle automated form submission
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ visible, eventName, userData, onClose, onSubmit }) => {
  const { name, email } = userData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(); // Call the passed onSubmit function
      setIsSubmitting(false);
      setIsSuccess(true); // Show success state

      // Auto-close the modal after 2 seconds
      setTimeout(() => {
        setIsSuccess(false); // Reset success state
        onClose(); // Close the modal
      }, 2000);
    } catch (error) {
      console.error('Error during submission:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          {!isSubmitting && !isSuccess && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          )}

          {/* Default Content */}
          {!isSuccess && (
            <>
              <Text style={styles.modalTitle}>Sign up for {eventName}</Text>
              <Text style={styles.label}>Name: {name}</Text>
              <Text style={styles.label}>Email: {email}</Text>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Success Content */}
          {isSuccess && (
            <View style={styles.successContent}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
              <Text style={styles.successMessage}>Event scheduled!</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff', // White background
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative', // Needed for the close button
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  successContent: {
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 12,
  },
});