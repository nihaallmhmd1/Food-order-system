export type Restaurant = {
    id: number;
    name: string;
    cuisine: string;
    rating: number;
  };
  
  export const restaurants: Restaurant[] = [
    {
      id: 1,
      name: "Burger House",
      cuisine: "Burgers",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Pizza Corner",
      cuisine: "Pizza",
      rating: 4.3,
    },
    {
      id: 3,
      name: "Indian Spice",
      cuisine: "Indian",
      rating: 4.7,
    },
  ];