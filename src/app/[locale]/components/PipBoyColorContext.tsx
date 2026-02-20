import { createContext, useContext, useState } from 'react';

const PipBoyColorContext = createContext();

export function PipBoyColorProvider({ children }) {
  const [color, setColor] = useState('#00ff00'); // Default Pip-Boy green
  return (
    <PipBoyColorContext.Provider value={{ color, setColor }}>
      {children}
    </PipBoyColorContext.Provider>
  );
}

export function usePipBoyColor() {
  return useContext(PipBoyColorContext);
}
