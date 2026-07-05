import { useRef, useState } from 'react';
import { useStore, exportBackup, parseBackup } from '../store';
import { VIEWS, CREED } from '../constants';
import type { ViewMode } from '../types';

export default function TopBar() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const search = useStore((s) => s.search);
  const setSearch = useStore((s) => s.setSearch);
  const nodes = useStore((s) => s.nodes);
  const addNode = useStore((s) => s.addNode);
  const importNodes = useStore((s) => s.importNodes);
  const resetToSeed = useStore((s) => s.resetToSeed);
  const saveState = useStore((s) => s.saveState);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState('');

  const onImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = parseBackup(text);
      if (
        window.confirm(
          `Replace the current map with ${parsed.length} nodes from this backup? Your current map will be overwritten.`,
        )
      ) {
        importNodes(parsed);
        setImportError('');
      }
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Could not read that file.');
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-row">
        <div className="brand">
          <span className="brand-mark">✦</span>
          <div>
            <h1>Life Command Center</h1>
            <p className="brand-creed">{CREED}</p>
          </div>
        </div>

        <div className="topbar-actions">
          <span
            className={`save-dot save-${saveState}`}
            title={
              saveState === 'saved'
                ? 'All changes saved locally in this browser'
                : saveState === 'saving'
                  ? 'Saving…'
                  : saveState === 'error'
                    ? 'Local save failed — export a JSON backup now'
                    : ''
            }
          >
            {saveState === 'saved' ? '● Saved locally' : saveState === 'saving' ? '◐ Saving…' : saveState === 'error' ? '▲ Save failed' : ''}
          </span>
          <span className="privacy-pill" title="No login, no cloud, no analytics. Data lives in this browser's IndexedDB and leaves only by manual export.">
            🛡 Local-only
          </span>
          <button className="btn btn-primary" onClick={() => addNode()}>
            + Thought
          </button>
          <button className="btn" onClick={() => exportBackup(Object.values(nodes))}>
            Export JSON
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            Import
          </button>
          <button
            className="btn btn-ghost"
            title="Restore the original starter skeleton"
            onClick={() => {
              if (window.confirm('Reset the map to the original seed skeleton? Current changes will be lost unless exported.')) {
                resetToSeed();
              }
            }}
          >
            Reset
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImportFile(f);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <div className="topbar-row topbar-row-2">
        <nav className="view-tabs" aria-label="View lens">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              className={`view-tab${view === v.id ? ' on' : ''}${v.placeholder ? ' placeholder' : ''}`}
              onClick={() => !v.placeholder && setView(v.id as ViewMode)}
              disabled={v.placeholder}
              title={v.tagline}
            >
              {v.label}
            </button>
          ))}
        </nav>
        <input
          className="search"
          type="search"
          placeholder="Search the map…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {importError && (
        <div className="import-error" role="alert">
          Import failed: {importError}{' '}
          <button className="btn-ghost" onClick={() => setImportError('')}>
            dismiss
          </button>
        </div>
      )}
    </header>
  );
}
