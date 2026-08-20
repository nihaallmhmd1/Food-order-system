import { Link } from "react-router-dom";
import type { Restaurant } from "../data/restaurants";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.cuisine}</p>
      <p>⭐ {restaurant.rating}</p>

      <Link to={`/restaurants/${restaurant.id}`}>
        View Restaurant
      </Link>
    </div>
  );
}

export default RestaurantCard;