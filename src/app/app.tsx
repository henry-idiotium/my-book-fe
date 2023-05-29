import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <div className="flex flex-col items-center box-content flex-[1]">
      <div className="text-base flex flex-col items-stretch w-full max-w-[120em]">
        <div className="w-full h-full px-[2em]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
