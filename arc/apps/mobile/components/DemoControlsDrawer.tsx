import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { triggerDemoSimulationApi } from '../services/api.ts';

interface DemoControlsDrawerProps {
  elderId: string;
  onSimulationTriggered: () => void;
}

export const DemoControlsDrawer: React.FC<DemoControlsDrawerProps> = ({
  elderId,
  onSimulationTriggered,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const runSimulation = async (actionType: string, payload = {}) => {
    try {
      setStatusMessage('Simulating...');
      const res = await triggerDemoSimulationApi(actionType, payload, elderId);
      setStatusMessage(res.message || 'Simulated event');
      onSimulationTriggered();
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16 }}>⚡</Text>
          <Text style={styles.headerTitle}>HACKATHON DEMO CONTROLS</Text>
        </View>
        <Text style={styles.expandIcon}>{isExpanded ? '▲ Hide' : '▼ Expand'}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.body}>
          <Text style={styles.notice}>
            Simulate realistic events instantly for judging without waiting for real scheduled times.
          </Text>

          {statusMessage && (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          )}

          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => runSimulation('SIMULATE_MEDICINE_REMINDER')}
            >
              <Text style={styles.demoBtnText}>💊 Simulate Med Reminder</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, styles.demoBtnWarn]}
              onPress={() => runSimulation('SIMULATE_MISSED_MEDICINE')}
            >
              <Text style={[styles.demoBtnText, { color: '#B45309' }]}>⚠️ Simulate Missed Dose</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => runSimulation('SIMULATE_DAILY_CHECKIN', { response: 'FINE' })}
            >
              <Text style={styles.demoBtnText}>😊 Simulate Morning Check-In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, styles.demoBtnDanger]}
              onPress={() => runSimulation('SIMULATE_FALL')}
            >
              <Text style={[styles.demoBtnText, { color: '#DC2626' }]}>🚨 Simulate Fall Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, styles.demoBtnDanger]}
              onPress={() => runSimulation('SIMULATE_EMERGENCY')}
            >
              <Text style={[styles.demoBtnText, { color: '#DC2626' }]}>🆘 Simulate SOS Alert</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => runSimulation('ADD_HEALTH_READING')}
            >
              <Text style={styles.demoBtnText}>🩺 Add Fresh BP 122/76</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  expandIcon: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  notice: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
  statusBox: {
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonGrid: {
    gap: 8,
  },
  demoBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  demoBtnWarn: {
    backgroundColor: '#451A03',
    borderColor: '#78350F',
  },
  demoBtnDanger: {
    backgroundColor: '#450A0A',
    borderColor: '#7F1D1D',
  },
  demoBtnText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
});
