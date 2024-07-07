export interface OrderItem {
    itemId: string;
    quantity: number;
  }
  
  export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    status: 'pending' | 'completed' | 'cancelled';
    deliveryDate: string;
    location: string;
    notes: string;
  }
  