// User types
export interface User {
  id: string;
  phoneNumber: string;
  name: string;
}

// Player types (for a specific game)
export interface Player {
  userId: string;
  phoneNumber: string;
  name: string;
  paymentStatus: 'pending' | 'paid';
  paymentId?: string;
}

// Game types
export interface Game {
  id: string;
  adminId: string;
  courtName: string;
  dateTime: string; // ISO date string
  totalCost: number;
  pricePerPlayer: number;
  players: Player[];
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  gameId: string;
  amount: number;
  timestamp: string; // ISO date string
  status: 'succeeded' | 'refunded';
} 