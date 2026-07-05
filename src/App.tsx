import { useEffect } from 'react';
import { useStore } from './store';
import TopBar from './components/TopBar';
import MapCanvas from './components/MapCanvas';
import BacklogBoard from './components/BacklogBoard';
import Inspector from './components/Inspector';
import PriorityLane from './components/PriorityLane';
import FirstRunNotice from './components/FirstRunNotice';

export default function App() {
  const loaded = useStore((s) => s.loaded);
  const view = useStore((s) => s.view);
  const init = useStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  if (!loaded) {
    return (
      <div className="boot">
        <span className="brand-mark">✦</span> Loading your map…
      </div>
    );
  }

  return (
    <div className="app">
      <FirstRunNotice />
      <TopBar />
      <main className="main">
        {view === 'backlog' ? <BacklogBoard /> : <MapCanvas />}
        <Inspector />
      </main>
      {view !== 'backlog' && <PriorityLane />}
    </div>
  );
}
