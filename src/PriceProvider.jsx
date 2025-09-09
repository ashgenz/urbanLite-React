// PriceProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const PriceContext = createContext();

export const PriceProvider = ({ children }) => {
  const [unitPrices, setUnitPrices] = useState(null);

  useEffect(() => {
    axios.get("/api/prices/config").then(res => {
      setUnitPrices(res.data);
    });
  }, []);

  return (
    <PriceContext.Provider value={unitPrices}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrices = () => useContext(PriceContext);
