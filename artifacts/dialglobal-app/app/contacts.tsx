import React, { useState } from "react";
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import C from "@/constants/colors";
import { useApp, Contact } from "@/context/AppContext";

const SAMPLE_CONTACTS: Contact[] = [
  { name: "Alice Johnson",    phone: "+1 415 555 0101", initials: "AJ" },
  { name: "Bob Nakamura",     phone: "+1 212 555 0172", initials: "BN" },
  { name: "Chidi Okeke",      phone: "+27 82 123 4567", initials: "CO" },
  { name: "Diana Ferreira",   phone: "+44 7911 123456", initials: "DF" },
  { name: "Ethan Goldberg",   phone: "+1 310 555 0198", initials: "EG" },
  { name: "Fatima Al-Hassan", phone: "+971 50 123 4567", initials: "FA" },
  { name: "Grace Thompson",   phone: "+61 4 1234 5678", initials: "GT" },
  { name: "Hassan Malik",     phone: "+92 300 1234567", initials: "HM" },
];

const COLORS = [C.accent, C.green, "#2563EB", C.red, "#7C3AED", C.blue];

export default function Contacts() {
  const insets = useSafeAreaInsets();
  const { contacts, importContacts } = useApp();
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [imported, setImported] = useState(false);
  const [mode, setMode]         = useState<"list" | "csv">("list");

  const all = [...SAMPLE_CONTACTS, ...contacts].filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const toggle = (phone: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(phone) ? n.delete(phone) : n.add(phone);
      return n;
    });
  };

  const doImport = () => {
    const toAdd = SAMPLE_CONTACTS.filter(c => selected.has(c.phone));
    importContacts(toAdd);
    setImported(true);
    setTimeout(() => { setImported(false); setSelected(new Set()); }, 2000);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={C.textSec} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Import Contacts</Text>
          <Text style={styles.headerSub}>Sync your contacts with DialGlobal</Text>
        </View>
      </View>

      <View style={styles.modeRow}>
        {([{ id: "list", label: "📱 Phone Contacts" }, { id: "csv", label: "📄 Import CSV" }] as const).map(m => (
          <Pressable
            key={m.id}
            style={[styles.modeChip, mode === m.id && styles.modeChipActive]}
            onPress={() => setMode(m.id)}
          >
            <Text style={[styles.modeChipTxt, mode === m.id && { color: C.accent }]}>{m.label}</Text>
          </Pressable>
        ))}
      </View>

      {mode === "csv" ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 14 }}>
          <Text style={{ fontSize: 56 }}>📄</Text>
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: C.text }}>Upload a CSV file</Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSec, textAlign: "center", lineHeight: 22 }}>
            Format: <Text style={{ fontFamily: "Inter_600SemiBold" }}>Name, Phone</Text> — one contact per row
          </Text>
          <View style={styles.dropZone}>
            <Feather name="upload" size={28} color={C.accent} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted, marginTop: 8 }}>
              Tap to browse files
            </Text>
          </View>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted }}>Supported: .csv, .vcf</Text>
        </View>
      ) : (
        <>
          <View style={styles.searchRow}>
            <View style={styles.searchWrap}>
              <Feather name="search" size={14} color={C.textMuted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search contacts…"
                placeholderTextColor={C.textMuted}
                style={styles.searchInput}
              />
            </View>
          </View>

          <View style={styles.selectAllRow}>
            <Text style={styles.countTxt}>{all.length} CONTACTS</Text>
            <Pressable onPress={() => selected.size === all.length ? setSelected(new Set()) : setSelected(new Set(all.map(c => c.phone)))}>
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, color: C.accent }}>
                {selected.size === all.length ? "Deselect all" : "Select all"}
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={all}
            keyExtractor={c => c.phone}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: (selected.size > 0 || imported) ? 80 : (insets.bottom + 16) }}
            renderItem={({ item: c, index: i }) => {
              const isSel = selected.has(c.phone);
              const color = COLORS[i % COLORS.length];
              return (
                <Pressable
                  style={[styles.contactRow, isSel && { backgroundColor: C.accentDim }]}
                  onPress={() => toggle(c.phone)}
                >
                  <View style={[styles.initials, { backgroundColor: color + "22" }]}>
                    <Text style={[styles.initialsText, { color }]}>{c.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactName}>{c.name}</Text>
                    <Text style={styles.contactPhone}>{c.phone}</Text>
                  </View>
                  <View style={[styles.checkBox, isSel && { backgroundColor: C.accent, borderColor: C.accent }]}>
                    {isSel && <Feather name="check" size={11} color={C.onAccent} strokeWidth={3} />}
                  </View>
                </Pressable>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
          />

          {(selected.size > 0 || imported) && (
            <View style={[styles.importFooter, { paddingBottom: insets.bottom + 14 }]}>
              {imported ? (
                <View style={styles.savedBanner}>
                  <Feather name="check" size={16} color={C.green} />
                  <Text style={styles.savedTxt}>Contacts imported!</Text>
                </View>
              ) : (
                <Pressable style={({ pressed }) => [styles.importBtn, { opacity: pressed ? 0.88 : 1 }]} onPress={doImport}>
                  <Text style={styles.importBtnTxt}>
                    Import {selected.size} Contact{selected.size !== 1 ? "s" : ""} →
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: C.surface },
  backBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.raised, alignItems: "center", justifyContent: "center", marginTop: 2 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 1 },
  modeRow: { flexDirection: "row", gap: 7, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  modeChip: { height: 28, paddingHorizontal: 12, borderRadius: 99, borderWidth: 1.5, borderColor: C.border },
  modeChipActive: { borderColor: C.accent, backgroundColor: C.accentDim },
  modeChipTxt: { fontFamily: "Inter_600SemiBold", fontSize: 11.5, color: C.textMuted, lineHeight: 26 },
  searchRow: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.bg },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: C.border, height: 38, paddingHorizontal: 12 },
  searchInput: { flex: 1, fontSize: 13, color: C.text, fontFamily: "Inter_400Regular" },
  selectAllRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 6 },
  countTxt: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: C.textMuted, letterSpacing: 0.5 },
  contactRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 11, gap: 12 },
  initials: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  initialsText: { fontFamily: "Inter_700Bold", fontSize: 13 },
  contactName: { fontFamily: "Inter_600SemiBold", fontSize: 13.5, color: C.text },
  contactPhone: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 2 },
  checkBox: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.borderStrong, alignItems: "center", justifyContent: "center" },
  sep: { height: 1, backgroundColor: C.border },
  dropZone: { width: "100%", height: 120, backgroundColor: C.surface, borderWidth: 2, borderColor: C.borderStrong, borderStyle: "dashed", borderRadius: 16, alignItems: "center", justifyContent: "center" },
  importFooter: { backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, padding: 14 },
  savedBanner: { height: 52, backgroundColor: C.greenDim, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  savedTxt: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.green },
  importBtn: { height: 52, backgroundColor: C.accent, borderRadius: 14, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  importBtnTxt: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.onAccent },
});
