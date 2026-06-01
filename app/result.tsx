import { Link, useSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

export default function ResultScreen() {
  const params = useSearchParams();
  const minPrice = params.min_price ? Number(params.min_price) : null;
  const maxPrice = params.max_price ? Number(params.max_price) : null;
  const avgSqm = params.avg_sqm_price ? Number(params.avg_sqm_price) : null;
  let factors: string[] = [];
  try {
    if (params.factors) {
      factors = JSON.parse(params.factors as string);
    }
  } catch (e) {
    factors = [];
  }

  const displayPrice = (v: number | null) => (v ? `₺${v.toLocaleString('tr-TR')}` : '—');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <Text style={styles.title}>Değerleme Sonucu</Text>
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Min Fiyat</Text>
          <Text style={styles.cardValue}>{displayPrice(minPrice)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Max Fiyat</Text>
          <Text style={styles.cardValue}>{displayPrice(maxPrice)}</Text>
        </View>
      </View>
      <View style={styles.cardSingle}>
        <Text style={styles.cardLabel}>Ortalama m² Fiyatı</Text>
        <Text style={styles.cardValue}>{avgSqm ? `₺${avgSqm.toLocaleString('tr-TR')}` : '—'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Öne Çıkan Faktörler</Text>
      {(factors.length ? factors : [
        'Konumun merkezi olması',
        'Bina yaşı ve yapı kalitesi',
        'Oda sayısı ve kullanım alanı',
        'Site içi / site dışı konumu',
        'Yakın çevredeki ulaşım ve sosyal imkanlar',
      ]).map((factor) => (
        <View key={factor} style={styles.factorRow}>
          <Text style={styles.factorBullet}>•</Text>
          <Text style={styles.factorText}>{factor}</Text>
        </View>
      ))}

      <Link href="/premium" asChild>
        <Pressable style={styles.premiumButton}>
          <Text style={styles.premiumText}>Premium paket ile daha fazla analiz</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#5A7FDB',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  cardSingle: {
    backgroundColor: '#111111',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    marginBottom: 24,
  },
  cardLabel: {
    color: '#D8C9F5',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '600',
  },
  cardValue: {
    color: '#F5F9F1',
    fontSize: 26,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#F5F0FF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  factorBullet: {
    color: '#A855F7',
    marginRight: 10,
    fontSize: 18,
    lineHeight: 22,
  },
  factorText: {
    color: '#E8DFFD',
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  premiumButton: {
    marginTop: 28,
    backgroundColor: '#5A7FDB',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
