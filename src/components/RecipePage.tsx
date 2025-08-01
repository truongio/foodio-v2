"use client";

import Link from "next/link";
import React, { useState } from "react";

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
  
  // Handle string amounts - check if it's a number with unit in the string (legacy format)
  if (typeof ingredient.amount === 'string') {
    // Try to parse legacy format like "300 g", "0.5 dl", or just "1"
    const unitMatch = ingredient.amount.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z()]+.*)$/);
    const numberMatch = ingredient.amount.match(/^(\d+(?:\.\d+)?)$/);
    
    if (unitMatch) {
      // Format like "300 g" or "1 tbsp (20 g)"
      const [, numStr, unit] = unitMatch;
      const num = parseFloat(numStr);
      const scaledAmount = num * scale;
      
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
    } else if (numberMatch) {
      // Format like "1" (just a number)
      const [, numStr] = numberMatch;
      const num = parseFloat(numStr);
      const scaledAmount = num * scale;
      
      // Format the scaled amount
      let formattedAmount: string;
      if (scaledAmount % 1 === 0) {
        formattedAmount = scaledAmount.toString();
      } else if (scaledAmount < 1) {
        formattedAmount = scaledAmount.toFixed(2).replace(/\.?0+$/, '');
      } else {
        formattedAmount = scaledAmount.toFixed(1).replace(/\.0$/, '');
      }
      
      return { amount: formattedAmount, unit: "" };
    }
    
    // For non-numeric strings like "1-2", "10 to 15", return as-is
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

function interpolateIngredients(text: string, ingredients: Ingredient[], scale: number): string {
  return text.replace(/\{ingredient\.(\d+)\}/g, (match, indexStr) => {
    const index = parseInt(indexStr, 10);
    if (index >= 0 && index < ingredients.length) {
      const ingredient = ingredients[index];
      const { amount, unit } = scaleIngredient(ingredient, scale);
      return formatIngredientDisplay(amount, unit);
    }
    return match; // Return original if index is invalid
  });
}

function renderMarkdown(text: string): React.ReactElement {
  // Simple markdown renderer for basic formatting
  const parts = text.split(/(\*\*[^*]+\*\*|##\s.*$)/gm);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Bold text
          const content = part.slice(2, -2);
          return <strong key={index}>{content}</strong>;
        } else if (part.startsWith('## ')) {
          // Heading
          const content = part.slice(3).trim();
          return <h3 key={index} className="text-lg font-medium mb-2 mt-6">{content}</h3>;
        } else {
          // Regular text - filter out empty parts
          return part ? <span key={index}>{part}</span> : null;
        }
      })}
    </>
  );
}

export default function RecipePage({ recipe }: RecipePageProps) {
  const [scale, setScale] = useState(1);

  const incrementScale = () => {
    setScale(prev => prev + 0.5);
  };

  const decrementScale = () => {
    setScale(prev => Math.max(0.5, prev - 0.5));
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
          
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={decrementScale}
              className="w-8 h-8 rounded bg-white text-black hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              −
            </button>
            <span className="w-8 text-center font-mono">
              {scale}
            </span>
            <button
              onClick={incrementScale}
              className="w-8 h-8 rounded bg-white text-black hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              +
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
          const interpolatedInstruction = interpolateIngredients(instruction, recipe.ingredients, scale);
          return (
            <div key={index} className="mb-4">
              {renderMarkdown(interpolatedInstruction)}
            </div>
          );
        })}
      </div>
    </div>
  );
}