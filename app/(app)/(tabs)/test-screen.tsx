// BARE TIL TESTING

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
  createParent, 
  getParent, 
  getAllParents, 
  updateParent, 
  deleteParent
} from '@/api/parents';
import {
  createChild,
  getChild,
  getAllChildren,
  getChildrenForParent,
  updateChild,
  deleteChild
} from '@/api/children';
import { uploadImageToFirebase } from '@/api/imageApi';
import { ChildProps } from '@/types/child';
import { ParentProps } from '@/types/parent';
import AddImageButtonSmall from '@/components/image/AddImageButtonSmall';
import ProfilePicture from '@/components/image/ProfilePicture';
import SelectImageModal from '@/components/image/SelectImageModal';

export default function TestScreen() {
  // Parent states
  const [parentFirstName, setParentFirstName] = useState('');
  const [parentLastName, setParentLastName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentId, setParentId] = useState('');
  const [parents, setParents] = useState<ParentProps[]>([]);

  // Child states
  const [childFirstName, setChildFirstName] = useState('');
  const [childLastName, setChildLastName] = useState('');
  const [childDateOfBirth, setChildDateOfBirth] = useState('');
  const [childAllergies, setChildAllergies] = useState('');
  const [childDepartment, setChildDepartment] = useState('');
  const [childId, setChildId] = useState('');
  const [children, setChildren] = useState<ChildProps[]>([]);

  // Image state
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [imageFor, setImageFor] = useState<'parent' | 'child'>('parent');

  // Parent CRUD operations
  const handleCreateParent = async () => {
    try {
      const parentData: Omit<ParentProps, 'id'> = {
        firstName: parentFirstName,
        lastName: parentLastName,
        eMail: parentEmail,
        phone: parentPhone,
        imageUri: uploadedPath || '',
        children: []
      };
      const id = await createParent(parentData);
      Alert.alert('Suksess', `Forelder opprettet med ID: ${id}`);
      setParentId(id);
      setParentFirstName('');
      setParentLastName('');
      setParentEmail('');
      setParentPhone('');
      setUploadedPath(null);
      setImageUri(null);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke opprette forelder');
      console.error(error);
    }
  };

  const handleGetParent = async () => {
    try {
      const parent = await getParent(parentId);
      if (parent) {
        Alert.alert('Forelder funnet', JSON.stringify(parent, null, 2));
      } else {
        Alert.alert('Ikke funnet', 'Ingen forelder med den ID-en');
      }
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke hente forelder');
      console.error(error);
    }
  };

  const handleGetAllParents = async () => {
    try {
      const allParents = await getAllParents();
      setParents(allParents);
      Alert.alert('Suksess', `Hentet ${allParents.length} foreldre`);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke hente foreldre');
      console.error(error);
    }
  };

  const handleUpdateParent = async () => {
    try {
      await updateParent(parentId, { 
        firstName: parentFirstName,
        lastName: parentLastName 
      });
      Alert.alert('Suksess', 'Forelder oppdatert');
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke oppdatere forelder');
      console.error(error);
    }
  };

  const handleDeleteParent = async () => {
    try {
      await deleteParent(parentId);
      Alert.alert('Suksess', 'Forelder slettet');
      setParentId('');
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke slette forelder');
      console.error(error);
    }
  };

  // Child CRUD operations
  const handleCreateChild = async () => {
    try {
      // Parse allergies from comma-separated string
      const allergiesArray = childAllergies
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const childData: Omit<ChildProps, 'id'> = {
        firstName: childFirstName,
        lastName: childLastName,
        dateOfBirth: childDateOfBirth,
        allergies: allergiesArray,
        imageUri: uploadedPath || '',
        parents: parentId ? [parentId] : [],
        checkedIn: false,
        department: childDepartment
      };
      const id = await createChild(childData);
      Alert.alert('Suksess', `Barn opprettet med ID: ${id}`);
      setChildId(id);
      setChildFirstName('');
      setChildLastName('');
      setChildDateOfBirth('');
      setChildAllergies('');
      setChildDepartment('');
      setUploadedPath(null);
      setImageUri(null);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke opprette barn');
      console.error(error);
    }
  };

  const handleGetChild = async () => {
    try {
      const child = await getChild(childId);
      if (child) {
        Alert.alert('Barn funnet', JSON.stringify(child, null, 2));
      } else {
        Alert.alert('Ikke funnet', 'Ingen barn med den ID-en');
      }
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke hente barn');
      console.error(error);
    }
  };

  const handleGetAllChildren = async () => {
    try {
      const allChildren = await getAllChildren();
      setChildren(allChildren);
      Alert.alert('Suksess', `Hentet ${allChildren.length} barn`);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke hente barn');
      console.error(error);
    }
  };

  const handleGetChildrenForParent = async () => {
    try {
      const parentChildren = await getChildrenForParent(parentId);
      setChildren(parentChildren);
      Alert.alert('Suksess', `Hentet ${parentChildren.length} barn for forelder`);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke hente barn for forelder');
      console.error(error);
    }
  };

  const handleUpdateChild = async () => {
    try {
      await updateChild(childId, { 
        firstName: childFirstName,
        lastName: childLastName 
      });
      Alert.alert('Suksess', 'Barn oppdatert');
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke oppdatere barn');
      console.error(error);
    }
  };

  const handleDeleteChild = async () => {
    try {
      await deleteChild(childId);
      Alert.alert('Suksess', 'Barn slettet');
      setChildId('');
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke slette barn');
      console.error(error);
    }
  };

  const handleToggleCheckedIn = async (child: ChildProps) => {
    try {
      await updateChild(child.id, { checkedIn: !child.checkedIn });
      Alert.alert('Suksess', `${child.firstName} er nå ${!child.checkedIn ? 'innsjekket' : 'utsjekket'}`);
      // Refresh children list
      handleGetAllChildren();
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke oppdatere innsjekking');
      console.error(error);
    }
  };

  // Image operations
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Feil', 'Velg et bilde først');
      return;
    }

    try {
      const path = await uploadImageToFirebase(imageUri);
      setUploadedPath(path);
      Alert.alert('Suksess', `Bilde lastet opp til: ${path}`);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke laste opp bilde');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🧪 API Test Skjerm</Text>

      {/* Image Section - Moved to top */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>🖼️ Bilde API</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.toggleButton, imageFor === 'parent' && styles.toggleButtonActive]} 
            onPress={() => setImageFor('parent')}
          >
            <Text style={[styles.buttonText, imageFor === 'parent' && styles.toggleButtonTextActive]}>
              For forelder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, imageFor === 'child' && styles.toggleButtonActive]} 
            onPress={() => setImageFor('child')}
          >
            <Text style={[styles.buttonText, imageFor === 'child' && styles.toggleButtonTextActive]}>
              For barn
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <Text style={styles.buttonText}>Velg bilde</Text>
        </TouchableOpacity>

        {imageUri && (
          <>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity style={styles.button} onPress={handleUploadImage}>
              <Text style={styles.buttonText}>Last opp til Firebase</Text>
            </TouchableOpacity>
          </>
        )}

        {uploadedPath && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Opplastet sti:</Text>
            <Text style={styles.resultText}>{uploadedPath}</Text>
            <Text style={styles.infoText}>
              📝 Denne stien vil bli brukt når du oppretter {imageFor === 'parent' ? 'forelder' : 'barn'}
            </Text>
          </View>
        )}
      </View> */}

      <View>
        <AddImageButtonSmall/>
      </View>
      <View>
        <ProfilePicture/>
        
      </View>

      {/* Parent Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👨‍👩‍👧 Foreldre API</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Fornavn"
          value={parentFirstName}
          onChangeText={setParentFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Etternavn"
          value={parentLastName}
          onChangeText={setParentLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-post"
          value={parentEmail}
          onChangeText={setParentEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefon"
          value={parentPhone}
          onChangeText={setParentPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Forelder ID (for oppdatering/sletting)"
          value={parentId}
          onChangeText={setParentId}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleCreateParent}>
            <Text style={styles.buttonText}>Opprett</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleGetParent}>
            <Text style={styles.buttonText}>Hent én</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleGetAllParents}>
            <Text style={styles.buttonText}>Hent alle</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleUpdateParent}>
            <Text style={styles.buttonText}>Oppdater</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteParent}>
            <Text style={styles.buttonText}>Slett</Text>
          </TouchableOpacity>
        </View>

        {parents.length > 0 && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Foreldre ({parents.length}):</Text>
            {parents.map((p) => (
              <View key={p.id} style={styles.card}>
                <Text style={styles.resultText}>
                  {p.firstName} {p.lastName}
                </Text>
                <Text style={styles.resultSubText}>
                  📧 {p.eMail}
                </Text>
                <Text style={styles.resultSubText}>
                  📱 {p.phone}
                </Text>
                <Text style={styles.resultSubText}>
                  👶 {p.children.length} barn
                </Text>
                {p.imageUri && (
                  <Text style={styles.resultSubText}>
                    🖼️ Bilde: {p.imageUri}
                  </Text>
                )}
                <Text style={styles.idText}>ID: {p.id}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Child Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👶 Barn API</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Fornavn"
          value={childFirstName}
          onChangeText={setChildFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Etternavn"
          value={childLastName}
          onChangeText={setChildLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Fødselsdato (YYYY-MM-DD)"
          value={childDateOfBirth}
          onChangeText={setChildDateOfBirth}
        />
        <TextInput
          style={styles.input}
          placeholder="Allergier (kommaseparert)"
          value={childAllergies}
          onChangeText={setChildAllergies}
        />
        <TextInput
          style={styles.input}
          placeholder="Avdeling"
          value={childDepartment}
          onChangeText={setChildDepartment}
        />
        <TextInput
          style={styles.input}
          placeholder="Forelder ID (for kobling)"
          value={parentId}
          onChangeText={setParentId}
        />
        <TextInput
          style={styles.input}
          placeholder="Barn ID (for oppdatering/sletting)"
          value={childId}
          onChangeText={setChildId}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleCreateChild}>
            <Text style={styles.buttonText}>Opprett</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleGetChild}>
            <Text style={styles.buttonText}>Hent én</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleGetAllChildren}>
            <Text style={styles.buttonText}>Hent alle</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleGetChildrenForParent}>
            <Text style={styles.buttonText}>Hent for forelder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleUpdateChild}>
            <Text style={styles.buttonText}>Oppdater</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteChild}>
            <Text style={styles.buttonText}>Slett</Text>
          </TouchableOpacity>
        </View>

        {children.length > 0 && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Barn ({children.length}):</Text>
            {children.map((c) => (
              <View key={c.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.resultText}>
                    {c.firstName} {c.lastName}
                  </Text>
                  <TouchableOpacity 
                    style={[styles.checkInButton, c.checkedIn && styles.checkInButtonActive]}
                    onPress={() => handleToggleCheckedIn(c)}
                  >
                    <Text style={styles.checkInButtonText}>
                      {c.checkedIn ? '✅' : '⭕'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.resultSubText}>
                  🎂 Født: {c.dateOfBirth}
                </Text>
                <Text style={styles.resultSubText}>
                  🏫 Avdeling: {c.department}
                </Text>
                {c.allergies.length > 0 && (
                  <Text style={styles.resultSubText}>
                    ⚠️ Allergier: {c.allergies.join(', ')}
                  </Text>
                )}
                <Text style={styles.resultSubText}>
                  👨‍👩‍👧 {c.parents.length} forelder(e)
                </Text>
                {c.imageUri && (
                  <Text style={styles.resultSubText}>
                    🖼️ Bilde: {c.imageUri}
                  </Text>
                )}
                <Text style={styles.idText}>ID: {c.id}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  toggleButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  resultBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultSubText: {
    fontSize: 13,
    marginVertical: 2,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idText: {
    fontSize: 10,
    color: '#999',
    marginTop: 6,
    fontFamily: 'monospace',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  checkInButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  checkInButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkInButtonText: {
    fontSize: 16,
  },
});