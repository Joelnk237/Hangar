'use client';

import { StellplatzFilters } from '@/app/types/property/filtertypes';
import { propertyData } from '@/app/types/property/propertyData';
import { stellplatzDataSearch } from '@/app/types/property/stellplatzData';
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react';

interface PropertyContextType {
  properties: stellplatzDataSearch[];
  setProperties: Dispatch<SetStateAction<stellplatzDataSearch[]>>;
  filters: StellplatzFilters;
  setFilters: any;
  updateFilter: (key: keyof StellplatzFilters, value: string) => void;
}

export const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [properties, setProperties] = useState<stellplatzDataSearch[]>([]);
  const [filters, setFilters] = useState<StellplatzFilters>({
    keyword: '',
    location: '',
    flugzeugtyp: '',
    flugzeuggroesse: '',
  });

  



  const updateFilter = (key: keyof StellplatzFilters, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        setProperties,
        filters,
        setFilters,
        updateFilter
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
