import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { valuateProperty } from '../services/api';

const cities = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Bursa',
  'Antalya',
  'Adana',
  'Gaziantep',
  'Konya',
  'Kayseri',
  'Mersin',
  'Sakarya',
  'Kocaeli',
  'Diyarbakır',
  'Şanlıurfa',
  'Trabzon',
  'Eskişehir',
  'Denizli',
  'Samsun',
  'Balıkesir',
  'Bolu',
];

const districtMap: Record<string, string[]> = {
  İstanbul: ['Kadıköy', 'Beşiktaş', 'Şişli', 'Bakırköy', 'Üsküdar'],
  Ankara: ['Çankaya', 'Keçiören', 'Mamak', 'Yenimahalle', 'Altındağ'],
  İzmir: ['Konak', 'Bornova', 'Karşıyaka', 'Çiğli', 'Buca'],
  Bursa: ['Nilüfer', 'Osmangazi', 'Yıldırım', 'Gemlik', 'Mudanya'],
  Antalya: ['Muratpaşa', 'Kepez', 'Alanya', 'Aksu', 'Manavgat'],
  Adana: ['Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam', 'Ceyhan'],
  Gaziantep: ['Şahinbey', 'Şehitkamil', 'Nizip', 'Oğuzeli', 'İslahiye'],
  Konya: ['Selçuklu', 'Karatay', 'Meram', 'Beyşehir', 'Ilgın'],
  Kayseri: ['Kocasinan', 'Melikgazi', 'Talas', 'Develi', 'İncesu'],
  Mersin: ['Yenişehir', 'Mezitli', 'Tarsus', 'Erdemli', 'Silifke'],
  Sakarya: ['Serdivan', 'Adapazarı', 'Erenler', 'Arifiye', 'Karasu'],
  Kocaeli: ['İzmit', 'Gebze', 'Kartepe', 'Gölcük', 'Darıca'],
  Diyarbakır: ['Yenişehir', 'Bağlar', 'Kayapınar', 'Eğil', 'Bismil'],
  'Şanlıurfa': ['Eyyübiye', 'Haliliye', 'Karaköprü', 'Suruç', 'Birecik'],
  Trabzon: ['Ortahisar', 'Akçaabat', 'Beşikdüzü', 'Maçka', 'Vakfıkebir'],
  Eskişehir: ['Tepebaşı', 'Odunpazarı', 'Seyitgazi', 'Alpu', 'Çifteler'],
  Denizli: ['Pamukkale', 'Merkezefendi', 'Çivril', 'Acıpayam', 'Tavas'],
  Samsun: ['Atakum', 'İlkadım', 'Canik', 'Bafra', 'Çarşamba'],
  Balıkesir: ['Karesi', 'Altıeylül', 'Bandırma', 'Edremit', 'Ayvalık'],
  Bolu: ['Merkez', 'Gerede', 'Mudurnu', 'Dörtdivan', 'Seben'],
};

const roomOptions = ['1+1', '2+1', '3+1', '4+1', '5+1'];

function Dropdown({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.dropdown} onPress={() => setOpen((prev) => !prev)}>
        <Text style={styles.dropdownText}>{value || 'Seçiniz'}</Text>
        <Text style={styles.dropdownArrow}>{open ? '▲' : '▼'}</Text>
      </Pressable>
      {open && (
        <ScrollView style={styles.dropdownList} nestedScrollEnabled>
          {options.map((option) => (
            <Pressable
              key={option}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(option);
                setOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [sqm, setSqm] = useState('');
  const [rooms, setRooms] = useState('2+1');
  const [floor, setFloor] = useState('1');
  const [age, setAge] = useState('5');
  const [furnished, setFurnished] = useState(true);
  const [site, setSite] = useState(true);
  const [loading, setLoading] = useState(false);

  const districtOptions = useMemo(
    () => (city && districtMap[city] ? districtMap[city] : ['Önce şehir seçin']),
    [city]
  );

  const handleValuate = async () => {
    if (!city || !district) {
      Alert.alert('Uyarı', 'Lütfen şehir ve ilçe seçiniz');
      return;
    }
    if (!sqm || parseFloat(sqm) <= 0) {
      Alert.alert('Uyarı', 'Lütfen metrekareyi giriniz');
      return;
    }

    setLoading(true);
    try {
      const result = await valuateProperty({
        city,
        district,
        sqm: parseFloat(sqm),
        rooms,
        floor: parseInt(floor),
        building_age: parseInt(age),
        furnished,
        in_complex: site,
      });
      // Pass result via route params (factors as JSON string)
      router.push({
        pathname: '/result',
        params: {
          min_price: String(result.min_price || 0),
          max_price: String(result.max_price || 0),
          avg_sqm_price: String(result.avg_sqm_price || 0),
          factors: JSON.stringify(result.factors || []),
        },
      });
    } catch (error) {
      Alert.alert('Hata', 'Değerleme işlemi başarısız oldu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.brand}>Emlak AI</Text>
          <Text style={styles.subbrand}>Premium Blue-Purple Teması</Text>
        </View>
        <View style={styles.iconBadge}>
          <Text style={styles.iconText}>🏠</Text>
        </View>
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Kalan Sorgu: 5/5</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Dropdown
          label="Şehir"
          value={city}
          options={cities}
          onSelect={(value) => {
            setCity(value);
            setDistrict('');
          }}
        />

        <Dropdown
          label="İlçe"
          value={district}
          options={districtOptions}
          onSelect={setDistrict}
        />

        <View style={styles.row}>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>Metrekare</Text>
            <TextInput
              style={styles.input}
              placeholder="m²"
              placeholderTextColor="#7f9e86"
              keyboardType="numeric"
              value={sqm}
              onChangeText={setSqm}
            />
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>Kat</Text>
            <TextInput
              style={styles.input}
              placeholder="Kat"
              placeholderTextColor="#7f9e86"
              keyboardType="numeric"
              value={floor}
              onChangeText={setFloor}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>Bina Yaşı</Text>
            <TextInput
              style={styles.input}
              placeholder="Yıl"
              placeholderTextColor="#7f9e86"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>Oda Sayısı</Text>
            <View style={styles.segmentRow}>
              {roomOptions.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.segmentButton,
                    rooms === option && styles.segmentButtonActive,
                  ]}
                  onPress={() => setRooms(option)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      rooms === option && styles.segmentTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.toggleGroup}>
          <Text style={styles.fieldLabel}>Eşyalı / Eşyasız</Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[
                styles.toggleButton,
                furnished && styles.toggleButtonActive,
              ]}
              onPress={() => setFurnished(true)}
            >
              <Text style={[styles.toggleText, furnished && styles.toggleTextActive]}>
                Eşyalı
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleButton,
                !furnished && styles.toggleButtonActive,
              ]}
              onPress={() => setFurnished(false)}
            >
              <Text style={[styles.toggleText, !furnished && styles.toggleTextActive]}>
                Eşyasız
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.toggleGroup}>
          <Text style={styles.fieldLabel}>Site İçi / Site Dışı</Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.toggleButton, site && styles.toggleButtonActive]}
              onPress={() => setSite(true)}
            >
              <Text style={[styles.toggleText, site && styles.toggleTextActive]}>
                Site İçi
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggleButton, !site && styles.toggleButtonActive]}
              onPress={() => setSite(false)}
            >
              <Text style={[styles.toggleText, !site && styles.toggleTextActive]}>
                Site Dışı
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable 
          style={[styles.ctaButton, loading && styles.ctaButtonDisabled]}
          onPress={handleValuate}
          disabled={loading}
        >
          <Text style={styles.ctaText}>
            {loading ? 'Değerlendiriliyor...' : 'Değerlendir'}
          </Text>
        </Pressable>

        <Link href="/result" asChild>
          <Pressable style={styles.linkButton}>
            <Text style={styles.linkText}>Sonuca Git</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 20,
    paddingTop: 34,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    color: '#5A7FDB',
    fontSize: 34,
    fontWeight: '800',
  },
  subbrand: {
    color: '#E8DFFD',
    marginTop: 6,
    fontSize: 14,
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#1A1533',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 28,
  },
  badgeRow: {
    marginBottom: 18,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(90, 127, 219, 0.12)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  badgeText: {
    color: '#5A7FDB',
    fontWeight: '700',
    fontSize: 13,
  },
  form: {
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 18,
  },
  fieldHalf: {
    flex: 1,
    marginBottom: 18,
    marginRight: 12,
  },
  fieldLabel: {
    color: '#D8C9F5',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#F5F9F1',
    fontSize: 16,
  },
  dropdownArrow: {
    color: '#A855F7',
    fontSize: 14,
  },
  dropdownList: {
    maxHeight: 180,
    marginTop: 10,
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    color: '#F5F9F1',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    color: '#F5F9F1',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segmentButton: {
    backgroundColor: '#111111',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    marginBottom: 8,
  },
  segmentButtonActive: {
    backgroundColor: '#5A7FDB',
    borderColor: '#5A7FDB',
  },
  segmentText: {
    color: '#F5F9F1',
    fontSize: 13,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toggleGroup: {
    marginBottom: 18,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#1E1E1E',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#5A7FDB',
    borderColor: '#5A7FDB',
  },
  toggleText: {
    color: '#F5F9F1',
    fontSize: 15,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  ctaButton: {
    backgroundColor: '#5A7FDB',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  ctaButtonDisabled: {
    backgroundColor: '#7B8FD8',
    opacity: 0.7,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  linkButton: {
    marginTop: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  linkText: {
    color: '#C9A3F5',
    fontSize: 15,
  },
});
