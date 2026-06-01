import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function PremiumScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>Limitinize Ulaştınız</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Premium Üyelik</Text>
        <Text style={styles.cardPrice}>250₺ / ay</Text>
        <Text style={styles.cardDescription}>
          Daha fazla rapor, detaylı bölge analizi ve sınırsız sorgu için premium plana geçin.
        </Text>
      </View>
      <Text style={styles.note}>
        Kalan sorgu hakkınız doldu. Aylık premium paket ile tüm verileri açın.
      </Text>
      <Link href="/" asChild>
        <Pressable style={styles.backButton}>
          <Text style={styles.backButtonText}>Ana Sayfaya Dön</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#5A7FDB',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    padding: 24,
    marginBottom: 24,
  },
  cardLabel: {
    color: '#D8C9F5',
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '600',
  },
  cardPrice: {
    color: '#F5F9F1',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
  },
  cardDescription: {
    color: '#E8DFFD',
    fontSize: 15,
    lineHeight: 24,
  },
  note: {
    color: '#F5F0FF',
    fontSize: 15,
    marginBottom: 28,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: '#5A7FDB',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
