import type { Food } from "../data/foods";
import { useCart } from "../context/CartContext";

type FoodCardProps = {
  food: Food;
};

function FoodCard({ food }: FoodCardProps) {
  const { addToCart } = useCart();

  return (
    <div>
      <h3>{food.name}</h3>

      <p>{food.description}</p>

      <p>₹{food.price}</p>

      <button
        onClick={() =>
          addToCart({
            id: food.id,
            name: food.name,
            price: food.price,
            image: "",
          })
        }
      >
        Add to Cart
      </button>
    </div>
  );
}

export default FoodCard;