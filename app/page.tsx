'use client';

import { useStore } from '@/lib/store';
import Dashboard from '@/components/Dashboard';
import PlannerScreen from '@/components/PlannerScreen';
import RenderScreen from '@/components/RenderScreen';
import ExportScreen from '@/components/ExportScreen';

export default function Home() {
  const activeScreen = useStore((s) => s.activeScreen);

  if (activeScreen === 'planner') return <PlannerScreen />;
  if (activeScreen === 'render') return <RenderScreen />;
  if (activeScreen === 'export') return <ExportScreen />;
  return <Dashboard />;
}
