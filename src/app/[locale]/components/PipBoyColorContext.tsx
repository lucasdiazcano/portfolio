import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

interface PipBoyColorState {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
}

const PipBoyColorContext = createContext<PipBoyColorState | undefined>(undefined);

/** Shares the selected Pip-Boy color with children. */
export function PipBoyColorProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState('#00ff00'); // Default Pip-Boy green
  return (
    <PipBoyColorContext.Provider value={{ color, setColor }}>
      {children}
    </PipBoyColorContext.Provider>
  );
}

/** Returns the nearest color provider, or undefined when used outside one. */
export function usePipBoyColor() {
  return useContext(PipBoyColorContext);
}
