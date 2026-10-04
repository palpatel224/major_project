import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

export interface StudyManifest {
  studyId: string;
  width: number;
  height: number;
  bitDepth: number;
  sliceCount: number;
  sliceFiles: string[];
  pixelSpacing: number[];
  laterality: string;
  studyDate: string;
}

// WHY: This hook handles the state and Tauri IPC calls required to pick a study,
// ask the sidecar to parse it, and read the resulting manifest. It encapsulates
// all the loading logic away from the UI components.
export function useStudyLoader() {
  const [manifest, setManifest] = useState<StudyManifest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressText, setProgressText] = useState<string>('');

  const loadStudy = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProgressText('Waiting for folder selection...');
    
    let unlistenStdout: UnlistenFn | null = null;
    let unlistenStderr: UnlistenFn | null = null;

    try {
      console.debug('Requesting folder selection dialog from Tauri');
      const folderPath = await invoke<string | null>('open_study_folder');
      
      if (!folderPath) {
        setIsLoading(false);
        setProgressText('');
        return;
      }

      console.debug(`Selected folder: ${folderPath}. Setting up event listeners.`);
      
      unlistenStdout = await listen<string>('sidecar-stdout', (event) => {
        setProgressText(event.payload.trim());
      });
      
      unlistenStderr = await listen<string>('sidecar-stderr', (event) => {
        console.error('Sidecar error:', event.payload);
      });

      console.debug('Invoking parse_dicom_study command');
      await invoke('parse_dicom_study', { studyPath: folderPath });

      // After parsing, we need to find out the studyId to read the manifest.
      // Wait, parse_dicom_study doesn't return the studyId currently.
      // Let's assume there is only one study parsed at a time in /tmp/oct-insight/
      // or we need to change parse_dicom_study to return the studyId.
      // Actually, since this is a viewer, we can just read the latest directory or
      // modify parse_dicom_study to return the study_id.
      // For now, we will get it via another way, or just fix `parse_dicom_study` to return it.
      // Let's assume we modify the sidecar and Tauri to return the studyId.
      // Actually, my sidecar logs: "Finished parsing study. Output location: /tmp/oct-insight/<study_id>"
      // I can change `read_study_manifest` to just take no args and read the latest one?
      // Wait, let's fix parse_dicom_study to return the study_id.
      // Since I wrote it to return "DICOM parsing started", I should change it.
      // For now, I will extract it from the progress text or just modify the Rust code later.
      // Wait, the sidecar is spawned and parse_dicom_study returns immediately ("DICOM parsing started").
      // We must listen for "sidecar-terminated" to know when it's done.
      
      await new Promise<void>((resolve, reject) => {
        let studyId = "";
        
        const cleanup = async () => {
          if (unlistenStdout) unlistenStdout();
          if (unlistenStderr) unlistenStderr();
        };

        listen<string>('sidecar-stdout', (event) => {
          const text = event.payload.trim();
          setProgressText(text);
          const match = text.match(/Output location: \/tmp\/oct-insight\/(.+)/);
          if (match) {
            studyId = match[1];
          }
        });

        listen<number>('sidecar-terminated', async (event) => {
          await cleanup();
          if (event.payload === 0 && studyId) {
            try {
              console.debug(`Sidecar terminated. Reading manifest for ${studyId}`);
              const manifestStr = await invoke<string>('read_study_manifest', { studyId });
              setManifest(JSON.parse(manifestStr));
              setIsLoading(false);
              resolve();
            } catch (err) {
              setError(String(err));
              setIsLoading(false);
              reject(err);
            }
          } else {
            const err = `Sidecar failed with code ${event.payload} or no studyId found.`;
            setError(err);
            setIsLoading(false);
            reject(new Error(err));
          }
        });
      });

    } catch (err) {
      console.error(err);
      setError(String(err));
      setIsLoading(false);
      if (unlistenStdout) unlistenStdout();
      if (unlistenStderr) unlistenStderr();
    }
  }, []);

  return { manifest, isLoading, error, progressText, loadStudy };
}
