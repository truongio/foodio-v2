import RecipePage from "@/components/RecipePage";
import { recipes } from "@/data/recipes";

export default function RaguPage() {
  return <RecipePage recipe={recipes.ragu} />;
}