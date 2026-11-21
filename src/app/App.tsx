
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { FleetProvider } from '@/core/store/fleet.context';

export default function App() {
  return (
    <FleetProvider>
      <RouterProvider router={router} />
    </FleetProvider>
  );
}
