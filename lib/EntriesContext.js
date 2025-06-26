// lib/EntriesContext.tsx
import { createContext, useContext } from "react";

const EntriesContext = createContext([]);

export const EntriesProvider = ({ children, entries }) => (
  <EntriesContext.Provider value={entries}>
    {children}
  </EntriesContext.Provider>
);

export const useEntries = () => useContext(EntriesContext);
