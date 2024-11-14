export interface StoreState {
    token: string | null;
    setToken: (token: string | null) => void;
    removeToken: () => void;
  
    role: string | null;
    setRole: (role: string | null) => void;
  
    id: string | null;
    setId: (id: string | null) => void;
  
  }