import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Switch, ActivityIndicator } from 'react-native';

export default function App() {
  const [form, setForm] = useState({
    city: '',
    district: '',
    sqm: '',
    rooms: '2+1',
    age: '',
    floor: '1',
    is_furnished: false,
    is_in_site: false
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const roomOptions = ['1+1', '2+1', '3+1', '4+1', '5+1'];

  // API URL - production'da environment variable'dan oku, local'de localhost kullan
  const getApiUrl = () => {
    // Vercel ve production environment'ında VITE_API_URL environment variable'ı kullanılır
    if (typeof process !== 'undefined' && process.env.VITE_API_URL) {
      return process.env.VITE_API_URL;
    }
    // Local development
    return 'http://localhost:8001';
  };

  const apiUrl = getApiUrl();

  const handleValuate = async () => {
    if (!form.city || !form.district || !form.sqm) {
      alert('Lütfen şehir, ilçe ve metrekare alanlarını doldurun.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        city: form.city,
        district: form.district,
        sqm: parseFloat(form.sqm),
        rooms: form.rooms || "2+1",
        floor: parseInt(form.floor) || 1,
        building_age: parseInt(form.age) || 0,
        furnished: form.is_furnished,
        in_complex: form.is_in_site
      };

      const response = await fetch(`${apiUrl}/api/valuate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Backend sunucusuna bağlanılamadı. Lütfen backendin çalıştığından emin olun.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>Prime AI</Text>
          <Text style={styles.brandSubtitle}>Emlak Değerleme Sistemi</Text>
          <Text style={styles.brandTagline}>Yapay Zeka Destekli Piyasa Analizi</Text>
        </View>

        <View style={styles.mainGrid}>
          {/* Left Panel - Form */}
          <View style={styles.formPanel}>
            <Text style={styles.formTitle}>Mülk Bilgileri</Text>
            <Text style={styles.formDescription}>Lütfen gayrimenkulün temel verilerini girin</Text>

            {/* Two-Column Layout for City & District */}
            <View style={styles.twoColumnRow}>
              <View style={styles.column}>
                <Text style={styles.label}>Şehir</Text>
                <TextInput
                  style={styles.input}
                  placeholder="İstanbul"
                  placeholderTextColor="#666"
                  value={form.city}
                  onChangeText={(text) => setForm({ ...form, city: text })}
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>İlçe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Kadıköy"
                  placeholderTextColor="#666"
                  value={form.district}
                  onChangeText={(text) => setForm({ ...form, district: text })}
                />
              </View>
            </View>

            {/* Two-Column Layout for SQM & Age */}
            <View style={styles.twoColumnRow}>
              <View style={styles.column}>
                <Text style={styles.label}>Metrekare (m²)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="120"
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                  value={form.sqm}
                  onChangeText={(text) => setForm({ ...form, sqm: text })}
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Bina Yaşı</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  value={form.age}
                  onChangeText={(text) => setForm({ ...form, age: text })}
                />
              </View>
            </View>

            {/* Room Selection - Button Group */}
            <View>
              <Text style={styles.label}>Oda Sayısı</Text>
              <View style={styles.roomButtonGroup}>
                {roomOptions.map((room) => (
                  <TouchableOpacity
                    key={room}
                    style={[
                      styles.roomButton,
                      form.rooms === room && styles.roomButtonActive
                    ]}
                    onPress={() => setForm({ ...form, rooms: room })}
                  >
                    <Text style={[
                      styles.roomButtonText,
                      form.rooms === room && styles.roomButtonTextActive
                    ]}>
                      {room}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Floor */}
            <View>
              <Text style={styles.label}>Bulunduğu Kat</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                value={form.floor}
                onChangeText={(text) => setForm({ ...form, floor: text })}
              />
            </View>

            {/* Toggles */}
            <View style={styles.toggleContainer}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Eşyalı</Text>
                <Switch
                  value={form.is_furnished}
                  onValueChange={(val) => setForm({ ...form, is_furnished: val })}
                  trackColor={{ false: '#334155', true: '#5a7fdb' }}
                  thumbColor={form.is_furnished ? '#a855f7' : '#cbd5e1'}
                />
              </View>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Site İçinde</Text>
                <Switch
                  value={form.is_in_site}
                  onValueChange={(val) => setForm({ ...form, is_in_site: val })}
                  trackColor={{ false: '#334155', true: '#5a7fdb' }}
                  thumbColor={form.is_in_site ? '#a855f7' : '#cbd5e1'}
                />
              </View>
            </View>

            {/* Analyze Button */}
            <TouchableOpacity
              style={[styles.analyzeButton, loading && styles.analyzeButtonLoading]}
              onPress={handleValuate}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.analyzeButtonText}>  Analiz Ediliyor...</Text>
                </View>
              ) : (
                <Text style={styles.analyzeButtonText}>✨ Yapay Zeka ile Değerlendir</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Right Panel - Results */}
          <View style={styles.resultsPanel}>
            {!result ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📊</Text>
                <Text style={styles.emptyStateTitle}>Analiz Sonuçu Bekleniyor</Text>
                <Text style={styles.emptyStateText}>
                  Mülk bilgilerini girin ve "Değerlendir" butonuna basın
                </Text>
              </View>
            ) : (
              <>
                {/* Google Search Grounding Badge */}
                <View style={styles.groundingBadge}>
                  <Text style={styles.groundingBadgeText}>✓ Google Search Grounding: Canlı Veri Doğrulaması Aktif</Text>
                </View>

                {/* Results Title */}
                <Text style={styles.resultsTitle}>📊 Piyasa Analiz Sonucu</Text>

                {/* Three Price Cards */}
                <View style={styles.priceCardsContainer}>
                  {/* Min Price Card */}
                  <View style={[styles.priceCard, styles.minCard]}>
                    <Text style={styles.cardLabel}>Min Fiyat</Text>
                    <Text style={styles.cardPrice}>{formatPrice(result.min_price).split(' ')[0]}</Text>
                    <Text style={styles.cardCurrency}>TL</Text>
                  </View>

                  {/* Max Price Card */}
                  <View style={[styles.priceCard, styles.maxCard]}>
                    <Text style={styles.cardLabel}>Max Fiyat</Text>
                    <Text style={styles.cardPrice}>{formatPrice(result.max_price).split(' ')[0]}</Text>
                    <Text style={styles.cardCurrency}>TL</Text>
                  </View>

                  {/* Average SQM Card */}
                  <View style={[styles.priceCard, styles.avgCard]}>
                    <Text style={styles.cardLabel}>Ort. m² Fiyatı</Text>
                    <Text style={styles.cardPrice}>{formatPrice(result.avg_sqm_price).split(' ')[0]}</Text>
                    <Text style={styles.cardCurrency}>TL/m²</Text>
                  </View>
                </View>

                {/* Analysis Factors */}
                {result.factors && result.factors.length > 0 && (
                  <View style={styles.factorsSection}>
                    <Text style={styles.factorsTitle}>💡 Piyasa Analiz Faktörleri</Text>
                    <View style={styles.factorsList}>
                      {result.factors.map((factor: string, idx: number) => (
                        <View key={idx} style={styles.factorItem}>
                          <Text style={styles.factorBullet}>●</Text>
                          <Text style={styles.factorText}>{factor}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* New Analysis Button */}
                <TouchableOpacity
                  style={styles.newAnalysisButton}
                  onPress={() => {
                    setResult(null);
                    setForm({
                      city: '',
                      district: '',
                      sqm: '',
                      rooms: '2+1',
                      age: '',
                      floor: '1',
                      is_furnished: false,
                      is_in_site: false
                    });
                  }}
                >
                  <Text style={styles.newAnalysisButtonText}>← Yeni Analiz</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0a0a0a',
    padding: 16
  },
  wrapper: {
    maxWidth: 1400,
    marginHorizontal: 'auto',
    width: '100%'
  },
  header: {
    marginBottom: 36,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a33'
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5a7fdb',
    marginBottom: 8,
    letterSpacing: 0.5
  },
  brandSubtitle: {
    fontSize: 18,
    color: '#d8c9f5',
    marginBottom: 4,
    fontWeight: '600'
  },
  brandTagline: {
    fontSize: 13,
    color: '#a0a0c0',
    fontStyle: 'italic'
  },
  mainGrid: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'space-between'
  },
  formPanel: {
    flex: 1,
    maxWidth: 500,
    backgroundColor: '#0f1728',
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: '#1a2b4d',
    shadowColor: '#5a7fdb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  formDescription: {
    fontSize: 13,
    color: '#888',
    marginBottom: 24
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  column: {
    flex: 1
  },
  label: {
    color: '#d8c9f5',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  input: {
    backgroundColor: '#1a2b4d',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2a3d5d',
    fontFamily: 'system-ui'
  },
  roomButtonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap'
  },
  roomButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1a2b4d',
    borderWidth: 1.5,
    borderColor: '#2a3d5d'
  },
  roomButtonActive: {
    backgroundColor: '#5a7fdb',
    borderColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3
  },
  roomButtonText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600'
  },
  roomButtonTextActive: {
    color: '#fff'
  },
  toggleContainer: {
    backgroundColor: '#1a2b4d',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    gap: 12
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  toggleLabel: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '500'
  },
  analyzeButton: {
    backgroundColor: '#5a7fdb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#5a7fdb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5
  },
  analyzeButtonLoading: {
    opacity: 0.8
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  resultsPanel: {
    flex: 1,
    minHeight: 600,
    backgroundColor: '#0f1728',
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: '#1a2b4d',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80
  },
  emptyStateIcon: {
    fontSize: 56,
    marginBottom: 16
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  emptyStateText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center'
  },
  groundingBadge: {
    backgroundColor: '#1a4d2e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2d8659',
    marginBottom: 20,
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2
  },
  groundingBadgeText: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16
  },
  priceCardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap'
  },
  priceCard: {
    flex: 1,
    minWidth: 140,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden'
  },
  minCard: {
    borderColor: '#5a7fdb',
    shadowColor: '#5a7fdb',
    shadowOpacity: 0.2
  },
  maxCard: {
    borderColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOpacity: 0.2
  },
  avgCard: {
    borderColor: '#06b6d4',
    shadowColor: '#06b6d4',
    shadowOpacity: 0.2
  },
  cardLabel: {
    color: '#a0a0c0',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8
  },
  cardPrice: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4
  },
  cardCurrency: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500'
  },
  factorsSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a2b4d'
  },
  factorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12
  },
  factorsList: {
    gap: 8
  },
  factorItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8
  },
  factorBullet: {
    color: '#a855f7',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2
  },
  factorText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    flex: 1
  },
  newAnalysisButton: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1a2b4d',
    borderWidth: 1.5,
    borderColor: '#5a7fdb',
    alignItems: 'center'
  },
  newAnalysisButtonText: {
    color: '#5a7fdb',
    fontSize: 14,
    fontWeight: '600'
  }
});
