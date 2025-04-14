import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function UploadScreen() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      uploadFiles(result.assets);
    }
  };

  const uploadFiles = async (files: any[]) => {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append('photo', {
        uri: file.uri,
        name: `photo_${index}.jpg`,
        type: 'image/jpeg',
      } as any);
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://192.168.0.104:3000/upload');
    setUploading(true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setProgress(0);
      if (xhr.status === 200) {
        alert('Files uploaded successfully!');
      } else {
        alert('Upload failed!');
      }
    };

    xhr.onerror = () => {
      alert('An error occurred during the upload.');
      setUploading(false);
    };

    xhr.send(formData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Photos for Backup</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
        <Ionicons name="cloud-upload-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Choose Photos</Text>
      </TouchableOpacity>

      {uploading && (
        <>
          <View style={styles.progressBarWrapper}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  progressBarWrapper: {
    width: '100%',
    height: 10,
    backgroundColor: '#e5e7eb', // light gray
    borderRadius: 5,
    marginTop: 24,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb', // blue
    borderRadius: 5,
  },
  progressText: {
    marginTop: 8,
    color: '#374151',
    fontSize: 16,
    textAlign: 'center',
  },
});