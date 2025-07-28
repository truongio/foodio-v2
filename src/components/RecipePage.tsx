"use client";

import Link from "next/link";
import { useState } from "react";

interface Ingredient {
  amount?: string;
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

function formatUnits(text: string | undefined): string {
  if (!text) return "";
  
  // Add thin non-breaking space between numbers and common units
  // Handle both cases: with space "100 g" and without space "100g"
  return text.replace(/(\d+(?:\.\d+)?)(\s*)(g|kg|ml|l|dl|cl|tbsp|tsp|cups?|oz|lbs?|°C|°F)\b/gi, '$1\u202F$3');
}

function scaleAmount(amount: string | undefined, scale: number): string | undefined {
  if (!amount) return amount;
  
  // Use a single comprehensive regex to handle all numbers and their units
  const numberRegex = /(\d+(?:\.\d+)?)(\s*)(g|grams?|ml|milliliters?|kg|l|dl|cl|tbsp|tsp|cups?|oz|lbs?|cm|mm|°C|°F|minutes?|mins?|hours?|hrs?|seconds?|secs?|celsius|degrees?)?/gi;
  
  return amount.replace(numberRegex, (match, numStr, spacing, unit) => {
    const num = parseFloat(numStr);
    const scaled = num * scale;
    
    // If there's no unit, or it's a time/temperature unit, just scale the number
    if (!unit || /^(minutes?|mins?|hours?|hrs?|seconds?|secs?|°C|°F|celsius|degrees?)$/i.test(unit)) {
      let scaledStr;
      if (scaled % 1 === 0) {
        scaledStr = scaled.toString();
      } else if (scaled < 1) {
        scaledStr = scaled.toFixed(2).replace(/\.?0+$/, '');
      } else {
        scaledStr = scaled.toFixed(1).replace(/\.0$/, '');
      }
      return scaledStr + spacing + (unit || '');
    }
    
    const lowerUnit = unit.toLowerCase();
    
    // Convert grams to kg if >= 1000
    if ((lowerUnit === 'g' || lowerUnit === 'gram' || lowerUnit === 'grams') && scaled >= 1000) {
      const kg = scaled / 1000;
      if (kg % 1 === 0) {
        return `${kg}\u202Fkg`;
      } else {
        return `${kg.toFixed(1).replace(/\.0$/, '')}\u202Fkg`;
      }
    }
    
    // Convert ml to l if >= 1000
    if ((lowerUnit === 'ml' || lowerUnit === 'milliliter' || lowerUnit === 'milliliters') && scaled >= 1000) {
      const l = scaled / 1000;
      if (l % 1 === 0) {
        return `${l}\u202Fl`;
      } else {
        return `${l.toFixed(1).replace(/\.0$/, '')}\u202Fl`;
      }
    }
    
    // Otherwise just scale the number normally
    let scaledStr;
    if (scaled % 1 === 0) {
      scaledStr = scaled.toString();
    } else if (scaled < 1) {
      scaledStr = scaled.toFixed(2).replace(/\.?0+$/, '');
    } else {
      scaledStr = scaled.toFixed(1).replace(/\.0$/, '');
    }
    
    return `${scaledStr}\u202F${unit}`;
  });
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
            const scaledAmount = scaleAmount(ingredient.amount, scale);
            const formattedAmount = formatUnits(scaledAmount);
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
                const scaledAmount = scaleAmount(topping.amount, scale);
                const formattedAmount = formatUnits(scaledAmount);
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
          const scaledInstruction = scaleAmount(instruction, scale) || instruction;
          const formattedInstruction = formatUnits(scaledInstruction);
          return (
            <p key={index} className="mb-4">
              {formattedInstruction}
            </p>
          );
        })}
      </div>
    </div>
  );
}