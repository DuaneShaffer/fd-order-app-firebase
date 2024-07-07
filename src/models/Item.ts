export interface AttributeHistory {
    date: string;
    caseSize: number;
    upc: string;
    weight: number;
  }
  
  export interface Item {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    attributes: {
      caseSize: number;
      upc: string;
      weight: number;
      history: AttributeHistory[];
    };
    isActive: boolean;
    isInAndOut: boolean;
  }
  