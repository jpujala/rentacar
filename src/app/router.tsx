
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/layout/app-layout';
import { DashboardScene } from '@/scenes/dashboard.scene';
import { CalendarScene } from '@/scenes/calendar.scene';
import { FleetScene } from '@/scenes/fleet.scene';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardScene /> },
      { path: 'calendar', element: <CalendarScene /> },
      { path: 'fleet', element: <FleetScene /> }
    ]
  }
]);
