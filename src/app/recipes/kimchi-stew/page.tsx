import RecipePage from "@/components/RecipePage";
import { recipes } from "@/data/recipes";

export default function KimchiStewPage() {
  return <RecipePage recipe={recipes["kimchi-stew"]} />;
}