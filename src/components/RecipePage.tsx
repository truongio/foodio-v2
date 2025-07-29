"use client";

import Link from "next/link";
import { useState } from "react";

interface Ingredient {
  amount?: number | string;
  unit?: string;
  item: string;
}

interface RecipeData {
  title: string;
  ingredients: Ingredient[];
  toppings?: Ingredient[];
  instructions: string[];
}

interface RecipePageProps {
  recipe: RecipeData;
}

function scaleIngredient(ingredient: Ingredient, scale: number): { amount: string; unit: string } {
  // Handle ingredients without amounts (like "Sesame seeds")
  if (ingredient.amount === undefined) {
    return { amount: "", unit: "" };
  }
  
  // Handle string amounts (like "1-2", "10 to 15")
  if (typeof ingredient.amount === 'string') {
    return { amount: ingredient.amount, unit: ingredient.unit || "" };
  }
  
  // Scale numeric amounts
  const scaledAmount = ingredient.amount * scale;
  const unit = ingredient.unit || "";
  
  // Auto-convert units if scaled amount is large enough
  if (unit === 'g' && scaledAmount >= 1000) {
    const kg = scaledAmount / 1000;
    const formattedKg = kg % 1 === 0 ? kg.toString() : kg.toFixed(1).replace(/\.0$/, '');
    return { amount: formattedKg, unit: "kg" };
  }
  
  if (unit === 'ml' && scaledAmount >= 1000) {
    const l = scaledAmount / 1000;
    const formattedL = l % 1 === 0 ? l.toString() : l.toFixed(1).replace(/\.0$/, '');
    return { amount: formattedL, unit: "l" };
  }
  
  // Format the scaled amount
  let formattedAmount: string;
  if (scaledAmount % 1 === 0) {
    formattedAmount = scaledAmount.toString();
  } else if (scaledAmount < 1) {
    formattedAmount = scaledAmount.toFixed(2).replace(/\.?0+$/, '');
  } else {
    formattedAmount = scaledAmount.toFixed(1).replace(/\.0$/, '');
  }
  
  return { amount: formattedAmount, unit };
}

function formatIngredientDisplay(amount: string, unit: string): string {
  if (!amount) return "";
  if (!unit) return amount;
  
  // Add thin non-breaking space between amount and unit
  return `${amount}\u202F${unit}`;
}

export default function RecipePage({ recipe }: RecipePageProps) {
  const [scale, setScale] = useState(1);

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
  };

  return (
    <div className="font-serif bg-white text-black flex h-screen justify-center items-center">
      <div className="pt-60 pb-8 px-8 lg:p-0 m-auto max-w-[1096px]">
        <Link
          href="/"
          className="inline-block mb-8 text-gray-600 no-underline text-base hover:text-black"
        >
          ← back
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-normal text-left">{recipe.title}</h1>
          
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">scale:</span>
            <button
              onClick={() => handleScaleChange(0.5)}
              className={`w-8 h-8 rounded border transition-colors ${
                scale === 0.5 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-300 hover:border-gray-400'
              }`}
            >
              ½
            </button>
            <button
              onClick={() => handleScaleChange(1)}
              className={`w-8 h-8 rounded border transition-colors ${
                scale === 1 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-300 hover:border-gray-400'
              }`}
            >
              1
            </button>
            <button
              onClick={() => handleScaleChange(2)}
              className={`w-8 h-8 rounded border transition-colors ${
                scale === 2 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-300 hover:border-gray-400'
              }`}
            >
              2
            </button>
            <button
              onClick={() => handleScaleChange(3)}
              className={`w-8 h-8 rounded border transition-colors ${
                scale === 3 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-300 hover:border-gray-400'
              }`}
            >
              3
            </button>
          </div>
        </div>

        <ul className="list-disc ml-6 mb-8">
          {recipe.ingredients.map((ingredient, index) => {
            const { amount, unit } = scaleIngredient(ingredient, scale);
            const formattedAmount = formatIngredientDisplay(amount, unit);
            return (
              <li key={index} className="mb-1">
                {formattedAmount ? `${formattedAmount} ` : ""}{ingredient.item}
              </li>
            );
          })}
        </ul>

        {recipe.toppings && (
          <>
            <h2 className="text-base font-normal mb-2 mt-8">top with</h2>
            <ul className="list-disc ml-6 mb-8">
              {recipe.toppings.map((topping, index) => {
                const { amount, unit } = scaleIngredient(topping, scale);
                const formattedAmount = formatIngredientDisplay(amount, unit);
                return (
                  <li key={index} className="mb-1">
                    {formattedAmount ? `${formattedAmount} ` : ""}{topping.item}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {recipe.instructions.map((instruction, index) => {
          return (
            <p key={index} className="mb-4">
              {instruction}
            </p>
          );
        })}
      </div>
    </div>
  );
}