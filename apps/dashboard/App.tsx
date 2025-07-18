
import React from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Header />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Dashboard />
        </div>
      </main>
    </div>
  );
}

export default App;
