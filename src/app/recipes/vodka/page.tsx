import RecipePage from "@/components/RecipePage";
import { recipes } from "@/data/recipes";

export default function VodkaPage() {
  return <RecipePage recipe={recipes.vodka} />;
}