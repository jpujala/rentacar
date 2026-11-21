
import { NavLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="app-menu">
        <h2>Rentacar</h2>

        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/calendar">Calendario</NavLink>
          <NavLink to="/fleet">Flota</NavLink>
        </nav>
      </aside>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
