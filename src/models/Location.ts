export interface Location {
    id: string;
    name: string;
    chain: string;
    basePrices: { [itemId: string]: number };
    promotions: Promotion[];
  }
  
  export interface Promotion {
    itemId: string;
    discount: number;
    startDate: string;
    endDate: string;
  }
  