import { getUserPin, setUserPin } from "@/api/pinApi";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

export default function PinCheck({
    uid,
    onUnlocked,
}: {
    uid: string,
    onUnlocked: () => void;
}) {
    const [savedPin, setSavedPin] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [pin, setPin] = useState("");
    const [confirm, setConfirm] = useState("")

    useEffect(() => {
        (async () => {
            const p = await getUserPin(uid);
            setSavedPin(p);
            setLoading(false);
        })();
    }, [uid]);

    const isValidPin = (p: string) => /^\d{4}$/.test(p); // gjør at man bare kan skrive tall fra 0-9

    async function submit() {
        setError(null);

        // case 1, har ikke pin, må opprettete
        if(!savedPin) {
            if(!isValidPin(pin)) return setError("PIN må være 4 siffer.");
            if(pin !== confirm) return setError("PIN-kodene må være like!");

            await setUserPin(uid, pin);
            setSavedPin(pin);
            setPin("");
            setConfirm("");
            onUnlocked();
            return;
        }

        // case 2, har pin, gå videre til appen
        if(pin === savedPin){
            setPin("");
            onUnlocked();
        } else {
            setError("Ugyldig PIN!");
        }
    }

    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: "center", padding: 24}}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    const title = savedPin ? "Skriv inn PIN" : "Opprett PIN";

    const canSubmit = savedPin ? pin.trim().length > 0 
    : pin.trim().length > 0 && confirm.trim().length > 0;

    return (
        <View style={{flex: 1, justifyContent: "center", padding: 24}}>
            <Text style={{fontSize: 22, fontWeight: "600", marginBottom: 12}}>{title}</Text>

            <TextInput
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            placeholder={savedPin ? "PIN" : "Ny PIN"}
            style={inputStyle}
            />

            {!savedPin && (
                <TextInput
                value={confirm}
                onChangeText={setConfirm}
                keyboardType="number-pad"
                secureTextEntry
                placeholder="Bekreft PIN"
                style={inputStyle}
            />
            )}

            {error && <Text style={{color: "red", marginBottom: 8 }}>{error}</Text>}

            <Pressable onPress={submit} style={buttonStyle} disabled={!canSubmit}>
                <Text style={{color: "white", fontWeight: "600"}}>
                    {savedPin ? "Lås opp" : "Lagre PIN"}
                </Text>
            </Pressable>
        </View>
    );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 12,
  fontSize: 18,
  marginBottom: 12,
  backgroundColor: "#fafafa",
} as const;

const buttonStyle = {
  backgroundColor: "#57507F",
  padding: 14,
  borderRadius: 10,
  alignItems: "center",
} as const;