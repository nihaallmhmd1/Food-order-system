export type Food = {
    id: number;
    restaurantId: number;
    name: string;
    description: string;
    price: number;
  };
  
  export const foods: Food[] = [
    {
      id: 1,
      restaurantId: 1,
      name: "Classic Burger",
      description: "Juicy chicken burger with fresh vegetables",
      price: 149,
    },
    {
      id: 2,
      restaurantId: 1,
      name: "Cheese Burger",
      description: "Chicken burger with melted cheese",
      price: 179,
    },
    {
      id: 3,
      restaurantId: 1,
      name: "Chicken Burger",
      description: "Crispy chicken burger",
      price: 199,
    },
  
    {
      id: 4,
      restaurantId: 2,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato and mozzarella",
      price: 249,
    },
    {
      id: 5,
      restaurantId: 2,
      name: "Farmhouse Pizza",
      description: "Pizza loaded with fresh vegetables",
      price: 299,
    },
  
    {
      id: 6,
      restaurantId: 3,
      name: "Butter Chicken",
      description: "Creamy Indian butter chicken",
      price: 299,
    },
    {
      id: 7,
      restaurantId: 3,
      name: "Chicken Biryani",
      description: "Aromatic basmati rice with chicken",
      price: 249,
    },
  ];