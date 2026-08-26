import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import CornerstoneViewport from './components/CornerstoneViewport';

function App() {
  const [modelStatus, setModelStatus] = useState<string>('Idle');

  const runInference = async () => {
    setModelStatus('Running...');
    try {
      // Calls the Rust command defined in lib.rs
      const response = await invoke<string>('run_inference', { 
        modelPath: '/path/to/model.bin', 
        studyPath: '/path/to/study' 
      });
      setModelStatus(response);
    } catch (error) {
      console.error(error);
      setModelStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-900 text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-6 text-violet-400">OCT Insight</h1>
        
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Study Navigator</h2>
            <div className="bg-neutral-800/50 rounded-md p-3 text-sm">
              <p>No study loaded</p>
              <button className="mt-2 text-xs bg-neutral-700 hover:bg-neutral-600 px-3 py-1.5 rounded transition-colors">
                Open OCT Study
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Model Hub</h2>
            <div className="bg-neutral-800/50 rounded-md p-3 text-sm">
              <select className="w-full bg-neutral-900 border border-neutral-700 rounded p-1 mb-2">
                <option>Cyst Segmentation v1.4</option>
              </select>
              <button 
                onClick={runInference}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-1.5 rounded transition-colors"
              >
                Run Inference
              </button>
              <p className="mt-2 text-xs text-neutral-400">Status: {modelStatus}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col p-4 bg-neutral-900 gap-4">
        {/* Toolbar */}
        <header className="h-12 bg-neutral-950 rounded-lg border border-neutral-800 flex items-center px-4 justify-between">
          <div className="flex space-x-4">
            <button className="hover:text-violet-400 transition-colors">Fit</button>
            <button className="hover:text-violet-400 transition-colors">1:1</button>
            <button className="hover:text-violet-400 transition-colors">Link Views</button>
          </div>
        </header>

        {/* Viewports */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-neutral-400">Original</h3>
            <div className="flex-1 rounded-lg border border-neutral-800 overflow-hidden">
               <CornerstoneViewport />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-violet-400 flex items-center">
              Model Output <span className="ml-2 text-[10px] bg-violet-900/50 text-violet-300 px-2 py-0.5 rounded-full">AI-Generated</span>
            </h3>
            <div className="flex-1 rounded-lg border border-violet-900/30 overflow-hidden relative">
               <CornerstoneViewport />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
