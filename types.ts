export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  shortDescription: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  tags: string[];
  category: string;
  materials: string;
  shipping: string;
}

export interface CartItem extends Product {
  size: string;
  quantity: number;
}

export type ViewState = 'home' | 'shop' | 'product-view' | 'checkout' | 'about';

export interface NavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  cartCount: number;
}
