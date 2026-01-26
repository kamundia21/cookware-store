export const products = [
  {
    id: 1,
    name: "Stainless Steel Fry Pan",
    brand: "Gotham",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200"
    ],
    rating: 4.8,
    reviews: 234,
    inStock: true,
    features: [
      "3-ply bonded construction",
      "Oven safe to 600°F",
      "Dishwasher safe"
    ]
  },
  {
    id: 2,
    name: "PET GLASS DOTTED",
    brand: "Generic",
    price: 100.00,
    image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR6Z8zHQ1xf0MUIsMq1mcZlbwnB03X_amUKPXLENZ-NQMuKbyWc",
    rating: 4.9,
    reviews: 567,
    inStock: true,
    features: [
      "🌻Material : Acrylic ",
      "🌻Capacity :400ml",
      "🌻Colour : Clear",
      "🌻 Size :8cmx15cmx5.5cm"
    ]
  },
  {
    id: 2,
    name: "Le Creuset Dutch Oven 5.5 Quart",
    brand: "Le Creuset",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800",
    rating: 4.9,
    reviews: 567,
    inStock: true,
    features: [
      "Superior heat retention",
      "Porcelain enamel coating",
      "Lifetime warranty"
    ]
  }
];

export const categories = [
  {
    name: "Cookware",
    subcategories: ["Saucepans", "Skillets", "Dutch Ovens"]
  },
  {
    name: "Knives",
    subcategories: ["Chef Knives", "Paring Knives", "Bread Knives"]
  }
];