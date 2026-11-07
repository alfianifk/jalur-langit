import "./global.css";

import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Circle } from "react-native-svg";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const doaList = [
  {
    title: "Doa sebelum tidur",
    category: "Harian",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    latin: "Bismika Allahumma amuutu wa ahyaa.",
    meaning: "Dengan nama-Mu, ya Allah, aku mati dan aku hidup.",
  },
  {
    title: "Doa bangun tidur",
    category: "Harian",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا",
    latin: "Alhamdu lillaahil-ladzii ahyaanaa ba'da maa amaatanaa.",
    meaning:
      "Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami.",
  },
  {
    title: "Doa memohon ilmu",
    category: "Belajar",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    latin: "Rabbi zidnii 'ilmaa.",
    meaning: "Ya Tuhanku, tambahkanlah ilmu kepadaku.",
  },
  {
    title: "Doa untuk kedua orang tua",
    category: "Keluarga",
    arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    latin: "Rabbir-hamhumaa kamaa rabbayaanii shaghiiraa.",
    meaning:
      "Wahai Tuhanku, sayangilah keduanya sebagaimana mereka mendidikku ketika kecil.",
  },
  {
    title: "Doa kebaikan dunia akhirat",
    category: "Harian",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    latin: "Rabbanaa aatinaa fid-dunyaa hasanah, wa fil-aakhirati hasanah.",
    meaning: "Ya Tuhan kami, berilah kami kebaikan di dunia dan di akhirat.",
  },
];

const menus = [
  { icon: "📖", title: "Al-Qur'an", subtitle: "Baca ayat suci" },
  { icon: "🤲", title: "Doa", subtitle: "Kumpulan doa" },
  { icon: "📿", title: "Dzikir", subtitle: "Ingat Allah" },
  { icon: "🕌", title: "Shalat", subtitle: "Jaga ibadah" },
];

const dzikirList = [
  {
    name: "Subhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    latin: "Subhanallah",
    meaning: "Mahasuci Allah.",
  },
  {
    name: "Alhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    latin: "Alhamdulillah",
    meaning: "Segala puji bagi Allah.",
  },
  {
    name: "Allahu Akbar",
    arabic: "اللَّهُ أَكْبَرُ",
    latin: "Allahu Akbar",
    meaning: "Allah Mahabesar.",
  },
  {
    name: "Astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    latin: "Astaghfirullah",
    meaning: "Aku memohon ampun kepada Allah.",
  },
  {
    name: "Laa ilaaha illallaah",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    latin: "Laa ilaaha illallaah",
    meaning: "Tiada Tuhan selain Allah.",
  },
  {
    name: "Laa hawla",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    latin: "Laa hawla wa laa quwwata illaa billaah",
    meaning: "Tiada daya dan kekuatan kecuali dengan pertolongan Allah.",
  },
  {
    name: "Sholawat",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
    latin: "Allahumma shalli 'ala Muhammad",
    meaning: "Ya Allah, limpahkanlah rahmat kepada Nabi Muhammad.",
  },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  // STATE DZIKIR
  const [selectedDzikir, setSelectedDzikir] = useState("Subhanallah");
  const [dzikirCounts, setDzikirCounts] = useState({});
  const [target, setTarget] = useState(33);
  const [customTarget, setCustomTarget] = useState("");
  const [loaded, setLoaded] = useState(false);

  // MEMUAT HITUNGAN DZIKIR TERSIMPAN
  useEffect(() => {
    async function loadDzikir() {
      try {
        const saved = await AsyncStorage.getItem("jalur_langit_dzikir");

        if (saved) {
          const data = JSON.parse(saved);
          setDzikirCounts(data.counts || {});
          setTarget(data.target || 33);
        }
      } catch (error) {
        console.log("Gagal membaca dzikir:", error);
      } finally {
        setLoaded(true);
      }
    }

    loadDzikir();
  }, []);

  // MENYIMPAN HITUNGAN OTOMATIS
  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(
      "jalur_langit_dzikir",
      JSON.stringify({
        counts: dzikirCounts,
        target: target,
      }),
    ).catch((error) => console.log("Gagal menyimpan:", error));
  }, [dzikirCounts, target, loaded]);

  const currentCount = dzikirCounts[selectedDzikir] || 0;

  // TAMBAH HITUNGAN
  const tambahDzikir = () => {
    setDzikirCounts((previous) => ({
      ...previous,
      [selectedDzikir]: (previous[selectedDzikir] || 0) + 1,
    }));
  };

  // RESET HITUNGAN
  const resetDzikir = () => {
    setDzikirCounts((previous) => ({
      ...previous,
      [selectedDzikir]: 0,
    }));
  };

  const filteredDoa = doaList.filter((doa) => {
    const cocokKategori = category === "Semua" || doa.category === category;

    const cocokCari =
      doa.title.toLowerCase().includes(search.toLowerCase()) ||
      doa.meaning.toLowerCase().includes(search.toLowerCase());

    return cocokKategori && cocokCari;
  });

  const openDoa = () => {
    setPage("doa");
    setCategory("Semua");
    setSearch("");
    setExpanded(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={["#F8FBFF", "#EAF3FC", "#F5F8FD"]}
        style={StyleSheet.absoluteFill}
      />

      {page === "home" ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.brand}>JALUR LANGIT</Text>
                <Text style={styles.brandSub}>YOUR SPIRITUAL JOURNEY</Text>
              </View>

              <View style={styles.profile}>
                <Text style={styles.profileText}>A</Text>
              </View>
            </View>

            <View style={styles.greeting}>
              <Text style={styles.eyebrow}>ASSALAMUALAIKUM ✦</Text>
              <Text style={styles.heading}>Temukan{"\n"}ketenangan.</Text>
              <Text style={styles.description}>
                Satu langkah kecil menuju Allah setiap hari.
              </Text>
            </View>

            <View style={styles.prayerCard}>
              <LinearGradient
                colors={["#438BCB", "#245B91", "#193B63"]}
                style={StyleSheet.absoluteFill}
              />

              <Text style={styles.prayerLabel}>WAKTU SHALAT BERIKUTNYA</Text>
              <Text style={styles.prayerName}>Subuh</Text>
              <Text style={styles.prayerTime}>04:30 WIB</Text>
              <View style={styles.divider} />
              <Text style={styles.prayerNote}>
                Awali harimu dengan mengingat Allah.
              </Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ibadah harian</Text>
              <Text style={styles.seeAll}>Lihat semua ›</Text>
            </View>

            <View style={styles.menuGrid}>
              {menus.map((menu) => (
                <Pressable
                  key={menu.title}
                  onPress={
                    menu.title === "Doa"
                      ? openDoa
                      : menu.title === "Dzikir"
                        ? () => setPage("dzikir")
                        : undefined
                  }
                  style={styles.menuCard}
                >
                  <BlurView
                    intensity={40}
                    tint="light"
                    style={StyleSheet.absoluteFill}
                  />

                  <Text style={styles.menuIcon}>{menu.icon}</Text>
                  <Text style={styles.menuTitle}>{menu.title}</Text>
                  <Text style={styles.menuSubtitle}>{menu.subtitle}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.quoteCard}>
              <Text style={styles.quoteLabel}>RENUNGAN HARI INI</Text>
              <Text style={styles.quote}>
                "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram."
              </Text>
              <Text style={styles.quoteSource}>QS. Ar-Ra'd: 28</Text>
            </View>
          </ScrollView>

          <BottomNav
            active="home"
            onHome={() => setPage("home")}
            onDoa={openDoa}
          />
        </>
      ) : page === "doa" ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.doaContent}
          >
            <View style={styles.pageHeader}>
              <Pressable
                onPress={() => setPage("home")}
                style={styles.backButton}
              >
                <Text style={styles.backArrow}>‹</Text>
              </Pressable>

              <View style={{ flex: 1 }}>
                <Text style={styles.pageTitle}>Kumpulan Doa</Text>
                <Text style={styles.pageSubtitle}>
                  Temukan doa untuk setiap langkah
                </Text>
              </View>

              <Text style={{ fontSize: 23 }}>🤲</Text>
            </View>

            <Text style={styles.doaHeading}>Dekatkan hati melalui doa.</Text>
            <Text style={styles.description}>
              Kumpulan doa untuk menemani keseharianmu.
            </Text>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Cari doa..."
              placeholderTextColor="#91A2B4"
              style={styles.searchInput}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categories}
            >
              {["Semua", "Harian", "Belajar", "Keluarga"].map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.category,
                    category === item && styles.categoryActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === item && styles.categoryTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.listHeading}>
              <Text style={styles.sectionTitle}>Doa pilihan</Text>
              <Text style={styles.resultCount}>{filteredDoa.length} doa</Text>
            </View>

            {filteredDoa.map((doa, index) => {
              const isOpen = expanded === doa.title;

              return (
                <Pressable
                  key={doa.title}
                  onPress={() => setExpanded(isOpen ? null : doa.title)}
                  style={styles.doaCard}
                >
                  <View style={styles.doaCardHeader}>
                    <Text style={styles.doaNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </Text>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.doaTitle}>{doa.title}</Text>
                      <Text style={styles.doaCategory}>{doa.category}</Text>
                    </View>

                    <Text style={styles.expandIcon}>{isOpen ? "−" : "+"}</Text>
                  </View>

                  <Text style={styles.arabic}>{doa.arabic}</Text>

                  {isOpen ? (
                    <View style={styles.doaDetail}>
                      <Text style={styles.detailLabel}>LATIN</Text>
                      <Text style={styles.detailText}>{doa.latin}</Text>

                      <View style={styles.dividerLight} />

                      <Text style={styles.detailLabel}>ARTI</Text>
                      <Text style={styles.detailText}>{doa.meaning}</Text>
                    </View>
                  ) : (
                    <Text style={styles.tapHint}>
                      Ketuk untuk melihat arti dan bacaan ›
                    </Text>
                  )}
                </Pressable>
              );
            })}

            {filteredDoa.length === 0 && (
              <Text style={styles.emptyText}>
                Doa tidak ditemukan. Coba kata kunci lain.
              </Text>
            )}

            <Text style={styles.sourceNote}>
              Konten doa ini merupakan contoh awal dan perlu diperiksa
              rujukannya sebelum dipublikasikan.
            </Text>
          </ScrollView>

          <BottomNav
            active="doa"
            onHome={() => setPage("home")}
            onDoa={openDoa}
          />
        </>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 28,
              paddingBottom: 50,
              alignItems: "center",
            }}
          >
            <View style={{ width: "100%", marginBottom: 25 }}>
              <Pressable
                onPress={() => setPage("home")}
                style={{ marginBottom: 24 }}
              >
                <Text style={{ fontSize: 25, color: "#397B9C" }}>‹</Text>
              </Pressable>

              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "700",
                  color: "#174F6B",
                  textAlign: "center",
                }}
              >
                Dzikir Harian
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#6A9BAE",
                  textAlign: "center",
                  marginTop: 6,
                }}
              >
                Tenangkan hati dengan mengingat Allah
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0, width: "100%" }}
              contentContainerStyle={{ gap: 9, paddingVertical: 8 }}
            >
              {dzikirList.map((item) => (
                <Pressable
                  key={item.name}
                  onPress={() => setSelectedDzikir(item.name)}
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 22,
                    backgroundColor:
                      selectedDzikir === item.name ? "#087DB3" : "#FFFFFF",
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedDzikir === item.name ? "#FFFFFF" : "#527B91",
                      fontWeight: "600",
                      fontSize: 12,
                    }}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <View
              style={{
                width: "100%",
                alignItems: "center",
                marginTop: 25,
              }}
            >
              <Text
                style={{
                  fontSize: 35,
                  color: "#174F6B",
                  textAlign: "center",
                  marginBottom: 18,
                }}
              >
                {
                  dzikirList.find((item) => item.name === selectedDzikir)
                    ?.arabic
                }
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  fontStyle: "italic",
                  color: "#159B83",
                }}
              >
                {dzikirList.find((item) => item.name === selectedDzikir)?.latin}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: "#668A9D",
                  marginTop: 9,
                  textAlign: "center",
                }}
              >
                {
                  dzikirList.find((item) => item.name === selectedDzikir)
                    ?.meaning
                }
              </Text>

              <Pressable
                onPress={tambahDzikir}
                style={{
                  marginTop: 22,
                  width: 230,
                  height: 230,
                  borderRadius: 120,
                  backgroundColor: "#DDF5FC",
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 9,
                  shadowColor: "#4A9DB8",
                  shadowOpacity: 0.18,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 8 },
                }}
              >
                <Svg width="230" height="230" style={{ position: "absolute" }}>
                  <Circle
                    cx="115"
                    cy="115"
                    r="94"
                    stroke="#C8E1E9"
                    strokeWidth="8"
                    fill="none"
                  />
                  <Circle
                    cx="115"
                    cy="115"
                    r="94"
                    stroke="#087DB3"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    rotation="-90"
                    origin="115, 115"
                    strokeDasharray={`${2 * Math.PI * 94} ${2 * Math.PI * 94}`}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      94 *
                      (1 - Math.min(currentCount / target, 1))
                    }
                  />
                </Svg>

                <Text
                  style={{
                    fontSize: 60,
                    fontWeight: "700",
                    color: "#087DB3",
                  }}
                >
                  {currentCount}
                </Text>
              </Pressable>

              <Text
                style={{
                  fontSize: 13,
                  color: "#648DA0",
                  marginTop: 18,
                }}
              >
                Putaran selesai: {Math.floor(currentCount / target)} · Total
                hari ini: {currentCount}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: "#648DA0",
                  marginTop: 18,
                }}
              >
                Target per putaran
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                {[33, 99, 100].map((number) => (
                  <Pressable
                    key={number}
                    onPress={() => setTarget(number)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 9,
                      borderRadius: 12,
                      backgroundColor:
                        target === number ? "#087DB3" : "#FFFFFF",
                    }}
                  >
                    <Text
                      style={{
                        color: target === number ? "#FFFFFF" : "#527B91",
                        fontWeight: "600",
                      }}
                    >
                      {number}
                    </Text>
                  </Pressable>
                ))}

                <Pressable
                  onPress={() => setTarget(999999)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 9,
                    borderRadius: 12,
                    backgroundColor: target === 999999 ? "#087DB3" : "#FFFFFF",
                  }}
                >
                  <Text
                    style={{
                      color: target === 999999 ? "#FFFFFF" : "#527B91",
                      fontWeight: "600",
                    }}
                  >
                    Bebas
                  </Text>
                </Pressable>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  gap: 9,
                  marginTop: 18,
                }}
              >
                <TextInput
                  value={customTarget}
                  onChangeText={setCustomTarget}
                  placeholder="Target sendiri"
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 13,
                    paddingHorizontal: 15,
                    color: "#174F6B",
                  }}
                />

                <Pressable
                  onPress={() => {
                    const value = parseInt(customTarget, 10);
                    if (value > 0) {
                      setTarget(value);
                      setCustomTarget("");
                    }
                  }}
                  style={{
                    backgroundColor: "#087DB3",
                    borderRadius: 13,
                    paddingHorizontal: 17,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                    Terapkan
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={resetDzikir}
                style={{ marginTop: 22, padding: 12 }}
              >
                <Text style={{ color: "#B66D78", fontWeight: "600" }}>
                  ↻ Reset hitungan
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}

function BottomNav({ active, onHome, onDoa }) {
  return (
    <View style={styles.bottomContainer}>
      <BlurView intensity={85} tint="light" style={styles.bottomBar}>
        <Pressable onPress={onHome} style={styles.navItem}>
          <Text style={active === "home" ? styles.navActive : styles.navIcon}>
            ⌂
          </Text>
          <Text style={active === "home" ? styles.tabActive : styles.tab}>
            Beranda
          </Text>
        </Pressable>

        <View style={styles.navItem}>
          <Text style={styles.navIcon}>▤</Text>
          <Text style={styles.tab}>Al-Qur'an</Text>
        </View>

        <Pressable onPress={onDoa} style={styles.navItem}>
          <Text style={active === "doa" ? styles.navActive : styles.navIcon}>
            ♡
          </Text>
          <Text style={active === "doa" ? styles.tabActive : styles.tab}>
            Doa
          </Text>
        </Pressable>

        <View style={styles.navItem}>
          <Text style={styles.navIcon}>◉</Text>
          <Text style={styles.tab}>Profil</Text>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F8FD" },

  content: {
    paddingHorizontal: 22,
    paddingTop: 62,
    paddingBottom: 150,
  },

  doaContent: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 150,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    fontSize: 15,
    fontWeight: "900",
    color: "#245B91",
    letterSpacing: 2,
  },

  brandSub: {
    fontSize: 8,
    color: "#8198B0",
    marginTop: 5,
    letterSpacing: 1.5,
  },

  profile: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: "#347FC4",
    fontWeight: "800",
    fontSize: 16,
  },

  greeting: { marginTop: 38, marginBottom: 23 },

  eyebrow: {
    color: "#5689BC",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.7,
  },

  heading: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "800",
    color: "#193B63",
    marginTop: 12,
  },

  description: {
    color: "#8192A5",
    fontSize: 12,
    marginTop: 8,
  },

  prayerCard: {
    overflow: "hidden",
    borderRadius: 26,
    padding: 23,
    minHeight: 194,
    justifyContent: "center",
  },

  prayerLabel: {
    color: "#D5E8F8",
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "800",
  },

  prayerName: {
    color: "white",
    fontSize: 29,
    fontWeight: "800",
    marginTop: 15,
  },

  prayerTime: {
    color: "white",
    fontSize: 23,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#FFFFFF40",
    marginTop: 17,
  },

  prayerNote: {
    color: "#D8E9F7",
    fontSize: 10,
    marginTop: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 31,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#193B63",
  },

  seeAll: {
    color: "#347FC4",
    fontSize: 10,
  },

  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  menuCard: {
    width: "48%",
    minHeight: 139,
    overflow: "hidden",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#FFFFFF90",
  },

  menuIcon: {
    fontSize: 23,
    marginBottom: 14,
  },

  menuTitle: {
    color: "#294663",
    fontSize: 13,
    fontWeight: "800",
  },

  menuSubtitle: {
    color: "#91A2B4",
    fontSize: 9,
    marginTop: 5,
  },

  quoteCard: {
    backgroundColor: "#E8F1FA",
    borderRadius: 22,
    padding: 19,
    marginTop: 8,
  },

  quoteLabel: {
    color: "#5689BC",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  quote: {
    color: "#294663",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 13,
    fontWeight: "600",
  },

  quoteSource: {
    color: "#7098BE",
    fontSize: 10,
    marginTop: 11,
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  backArrow: {
    color: "#347FC4",
    fontSize: 31,
    lineHeight: 35,
  },

  pageTitle: {
    color: "#193B63",
    fontSize: 18,
    fontWeight: "800",
  },

  pageSubtitle: {
    color: "#8198B0",
    fontSize: 10,
    marginTop: 3,
  },

  doaHeading: {
    color: "#193B63",
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 5,
  },

  searchInput: {
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFFB8",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingHorizontal: 15,
    marginTop: 20,
    color: "#294663",
    fontSize: 12,
  },

  categories: {
    gap: 8,
    paddingVertical: 17,
  },

  category: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },

  categoryActive: {
    backgroundColor: "#347FC4",
  },

  categoryText: {
    color: "#6F879F",
    fontSize: 10,
    fontWeight: "700",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  listHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  resultCount: {
    color: "#91A2B4",
    fontSize: 10,
  },

  doaCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFFA8",
    padding: 16,
    marginBottom: 11,
  },

  doaCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  doaNumber: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#E3EFFB",
    color: "#347FC4",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 10,
    fontWeight: "800",
    overflow: "hidden",
    paddingTop: 10,
  },

  doaTitle: {
    color: "#294663",
    fontSize: 12,
    fontWeight: "800",
  },

  doaCategory: {
    color: "#91A2B4",
    fontSize: 9,
    marginTop: 3,
  },

  expandIcon: {
    color: "#6D9CC7",
    fontSize: 22,
  },

  arabic: {
    color: "#193B63",
    fontSize: 21,
    lineHeight: 40,
    textAlign: "right",
    marginTop: 17,
  },

  tapHint: {
    color: "#91A2B4",
    fontSize: 9,
    marginTop: 12,
  },

  doaDetail: {
    borderTopWidth: 1,
    borderTopColor: "#DCEAF6",
    marginTop: 14,
    paddingTop: 13,
  },

  detailLabel: {
    color: "#6D9CC7",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  detailText: {
    color: "#526E89",
    fontSize: 11,
    lineHeight: 19,
    marginTop: 6,
  },

  dividerLight: {
    height: 1,
    backgroundColor: "#DCEAF6",
    marginVertical: 12,
  },

  emptyText: {
    color: "#8192A5",
    textAlign: "center",
    padding: 25,
    fontSize: 12,
  },

  sourceNote: {
    color: "#91A2B4",
    fontSize: 9,
    lineHeight: 15,
    marginTop: 10,
    textAlign: "center",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 17,
    left: 20,
    right: 20,
    borderRadius: 25,
    elevation: 9,
  },

  bottomBar: {
    height: 72,
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F9FCFF",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  navIcon: {
    color: "#91A2B4",
    fontSize: 19,
  },

  navActive: {
    color: "#347FC4",
    fontSize: 21,
    fontWeight: "800",
  },

  tab: {
    color: "#91A2B4",
    fontSize: 9,
  },

  tabActive: {
    color: "#347FC4",
    fontSize: 9,
    fontWeight: "800",
  },
});
