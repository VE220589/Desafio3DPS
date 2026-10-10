import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// Se importa desde /legacy para compatibilidad completa y eliminar los warnings en SDK 54
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME_COLORS } from '../constants/config';

export default function CameraScreen(): JSX.Element {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [procesando, setProcesando] = useState<boolean>(false);
  
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={THEME_COLORS.accent} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={64} color={THEME_COLORS.textMuted} />
        <Text style={styles.permissionText}>
          Se requiere acceso a la cámara para tomar evidencia del fallo.
        </Text>
        <TouchableOpacity style={styles.btnPermiso} onPress={requestPermission}>
          <Text style={styles.btnPermisoText}>Conceder Permiso</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnVolver} onPress={() => router.back()}>
          <Text style={styles.btnVolverText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = (): void => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const tomarYGuardarFoto = async (): Promise<void> => {
    if (cameraRef.current && !procesando) {
      setProcesando(true);
      try {
        // Tomar la captura con compresión moderada
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });

        if (photo && photo.uri) {
          const carpetaDestino = `${FileSystem.documentDirectory}evidencias_tickets/`;

          // Verificar si existe la carpeta; si no, crearla con soporte de intermedias
          const dirInfo = await FileSystem.getInfoAsync(carpetaDestino);
          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(carpetaDestino, { intermediates: true });
          }

          const nombreArchivo = `evidencia_${Date.now()}.jpg`;
          const nuevaRuta = `${carpetaDestino}${nombreArchivo}`;

          // copyAsync copia los bytes sin bloquearse por restricciones del sistema de archivos
          await FileSystem.copyAsync({
            from: photo.uri,
            to: nuevaRuta,
          });

          // Retornar al formulario create.tsx inyectando la ruta local
          router.navigate({
            pathname: '/(tabs)/create',
            params: { imageUri: nuevaRuta },
          });
        } else {
          throw new Error('La cámara no devolvió una imagen válida.');
        }
      } catch (error) {
        console.error('Error detallado al guardar la foto:', error);
        const mensaje = error instanceof Error ? error.message : 'No se pudo guardar la fotografía.';
        Alert.alert('Error', mensaje);
      } finally {
        setProcesando(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.overlay}>
          {/* Botón Cerrar */}
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.bottomControls}>
            {/* Botón Voltear Cámara */}
            <TouchableOpacity style={styles.iconBtn} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse-outline" size={28} color="#FFF" />
            </TouchableOpacity>

            {/* Disparador */}
            <TouchableOpacity 
              style={[styles.captureBtn, procesando && styles.captureBtnDisabled]} 
              onPress={tomarYGuardarFoto}
              disabled={procesando}
            >
              {procesando ? (
                <ActivityIndicator color={THEME_COLORS.accent} size="large" />
              ) : (
                <View style={styles.captureBtnInner} />
              )}
            </TouchableOpacity>

            <View style={styles.spacer} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: THEME_COLORS.background,
  },
  permissionText: {
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
    color: THEME_COLORS.text,
    fontSize: 16,
  },
  btnPermiso: {
    backgroundColor: THEME_COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  btnPermisoText: { color: '#FFF', fontWeight: 'bold' },
  btnVolver: { paddingVertical: 12 },
  btnVolverText: { color: THEME_COLORS.textMuted, fontWeight: '600' },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: 30,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  iconBtn: { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 30, padding: 12 },
  spacer: { width: 52 },
  captureBtn: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  captureBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF' },
  captureBtnDisabled: { opacity: 0.5 },
});