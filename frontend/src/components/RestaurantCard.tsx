import { Link } from "react-router-dom";

// Updated type matching MongoDB document schema
export type Restaurant = {
  _id: string;
  name: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
};

type RestaurantCardProps = {
  restaurant: Restaurant;
};

function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div>
      <h2>{restaurant.name}</h2>
      {/* Joined cuisine array since MongoDB stores it as an array of strings */}
      <p>{Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(" • ") : restaurant.cuisine}</p>
      <p>⭐ {restaurant.rating}</p>

      {/* Changed restaurant.id to restaurant._id for MongoDB */}
      <Link to={`/restaurants/${restaurant._id}`}>
        View Restaurant
      </Link>
    </div>
  );
}

export default RestaurantCard;