import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SafeCallModalProps {
  contactName: string;
  relationship: string;
  phoneNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SafeCallModal: React.FC<SafeCallModalProps> = ({
  contactName,
  relationship,
  phoneNumber,
  isOpen,
  onClose,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'CONNECTING' | 'CONNECTED'>('CONNECTING');

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setCallStatus('CONNECTING');
      return;
    }

    const timer = setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 1500);

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Avatar Icon */}
          <View style={styles.avatar}>
            <Text style={{ fontSize: 44 }}>👨‍🦳</Text>
          </View>

          <Text style={styles.name}>{contactName}</Text>
          <Text style={styles.relationship}>{relationship}</Text>
          <Text style={styles.phone}>{phoneNumber}</Text>

          {/* Status Badge */}
          <View style={[styles.statusBadge, callStatus === 'CONNECTED' ? styles.statusConnected : styles.statusConnecting]}>
            <Text style={styles.statusText}>
              {callStatus === 'CONNECTING' ? 'Connecting Call...' : `Connected • ${formatSeconds(callDuration)}`}
            </Text>
          </View>

          <Text style={styles.notice}>
            🛡️ ARC Safe Call: Simulated secure caregiver connection
          </Text>

          {/* End Call Button */}
          <TouchableOpacity style={styles.endBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.endBtnText}>🔴 End Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 28,
    width: '90%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  relationship: {
    fontSize: 16,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 6,
  },
  phone: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 18,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusConnecting: {
    backgroundColor: '#D97706',
  },
  statusConnected: {
    backgroundColor: '#16A34A',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  notice: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
  },
  endBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  endBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
