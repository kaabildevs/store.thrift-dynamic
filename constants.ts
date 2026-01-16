import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'VINTAGE 1992 BOMBER',
    price: 245,
    shortDescription: 'Authentic 90s aviator silhouette with distressed leather finish.',
    description: 'This rare find from the early 90s features heavy-duty brass hardware and a quilted lining. The leather has developed a unique patina over decades of wear, making it a true one-of-a-kind archival piece. Perfect for layering in transitional weather.',
    images: [
      'https://picsum.photos/id/1005/800/1000',
      'https://picsum.photos/id/1006/800/1000',
      'https://picsum.photos/id/1009/800/1000'
    ],
    rating: 4.8,
    reviewsCount: 12,
    tags: ['#Vintage', '#90s', '#Leather', '#Outerwear'],
    category: 'Jackets',
    materials: '100% Genuine Leather, Acetate Lining.',
    shipping: 'Ships within 24 hours. Global express available.'
  },
  {
    id: 'p2',
    name: 'ACID WASH HEAVY TEE',
    price: 65,
    shortDescription: 'Boxy fit heavyweight cotton with artisanal acid wash treatment.',
    description: 'Constructed from 280gsm French Terry cotton, this tee offers a structured drape that holds its shape. The acid wash process is done by hand in our studio, ensuring no two pieces are exactly alike.',
    images: [
      'https://picsum.photos/id/1012/800/1000',
      'https://picsum.photos/id/1011/800/1000',
      'https://picsum.photos/id/1013/800/1000'
    ],
    rating: 4.9,
    reviewsCount: 45,
    tags: ['#Streetwear', '#AcidWash', '#Essentials'],
    category: 'Tees',
    materials: '100% Heavyweight Cotton.',
    shipping: 'Standard 3-5 day shipping.'
  },
  {
    id: 'p3',
    name: 'PARACHUTE CARGO PANTS',
    price: 180,
    shortDescription: 'Tech-wear inspired wide leg trousers with multiple utility pockets.',
    description: 'Redefining utility, these parachute pants feature adjustable toggle cuffs and an elasticated waistband for versatility. The nylon blend fabric is water-resistant and durable, suitable for the urban explorer.',
    images: [
      'https://picsum.photos/id/103/800/1000',
      'https://picsum.photos/id/104/800/1000',
      'https://picsum.photos/id/106/800/1000'
    ],
    rating: 4.7,
    reviewsCount: 28,
    tags: ['#Techwear', '#Utility', '#Pants'],
    category: 'Pants',
    materials: 'Nylon/Cotton Blend.',
    shipping: 'Free shipping on orders over $150.'
  },
  {
    id: 'p4',
    name: 'DISTRESSED DENIM TYPE-III',
    price: 210,
    shortDescription: 'Hand-distressed Japanese selvedge denim jacket.',
    description: 'A brutalist take on the classic trucker jacket. Sourced from Okayama, this 14oz selvedge denim has been rigorously distressed to mimic 10 years of hard wear. Features iron buttons and contrast stitching.',
    images: [
      'https://picsum.photos/id/342/800/1000',
      'https://picsum.photos/id/343/800/1000',
      'https://picsum.photos/id/344/800/1000'
    ],
    rating: 5.0,
    reviewsCount: 8,
    tags: ['#Denim', '#Japanese', '#Workwear'],
    category: 'Jackets',
    materials: '100% Cotton Selvedge Denim.',
    shipping: 'Ships within 48 hours.'
  },
  {
    id: 'p5',
    name: 'ARCHIVE HOODIE - ONYX',
    price: 120,
    shortDescription: 'Oversized silhouette with drop shoulders and raw hem.',
    description: 'The ultimate everyday layer. This hoodie features a double-lined hood and a kangaroo pocket. The raw hem adds a grunge aesthetic, while the ultra-soft fleece interior ensures maximum comfort.',
    images: [
      'https://picsum.photos/id/338/800/1000',
      'https://picsum.photos/id/339/800/1000',
      'https://picsum.photos/id/340/800/1000'
    ],
    rating: 4.6,
    reviewsCount: 62,
    tags: ['#Streetwear', '#Hoodie', '#BlackOnBlack'],
    category: 'Hoodies',
    materials: '80% Cotton, 20% Polyester.',
    shipping: 'Standard shipping rates apply.'
  },
  {
    id: 'p6',
    name: 'PATCHWORK FLANNEL',
    price: 155,
    shortDescription: 'Reconstructed flannel shirt made from vintage fabrics.',
    description: 'Sustainability meets style. Each shirt is reconstructed from upcycled vintage flannel shirts, creating a unique patchwork design. No two shirts have the same pattern layout.',
    images: [
      'https://picsum.photos/id/445/800/1000',
      'https://picsum.photos/id/446/800/1000',
      'https://picsum.photos/id/447/800/1000'
    ],
    rating: 4.8,
    reviewsCount: 15,
    tags: ['#Sustainable', '#Upcycled', '#Flannel'],
    category: 'Shirts',
    materials: 'Mixed Cotton Flannel Fabrics.',
    shipping: 'Eco-friendly packaging included.'
  }
];
