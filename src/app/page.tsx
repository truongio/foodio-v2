import Link from "next/link";

const recipes = [
  { name: "fagioli", href: "/recipes/fagioli", italic: false },
  { name: "checca", href: "/recipes/checca", italic: true },
  { name: "kimchi stew", href: "/recipes/kimchi-stew", italic: false },
  { name: "ragù", href: "/recipes/ragu", italic: true },
  { name: "steak", href: "/recipes/steak", italic: false },
  { name: "vodka", href: "/recipes/vodka", italic: true },
  { name: "butadon", href: "/recipes/butadon", italic: false },
];

export default function Home() {
  return (
    <div className="font-serif bg-white text-black min-h-screen flex flex-col justify-center items-center px-8 lg:items-start lg:pl-[25%] lg:px-0">
      <main className="max-w-4xl w-full">
        <div className="text-3xl sm:text-4xl leading-relaxed text-center lg:text-left">
          {recipes.map((recipe, index) => (
            <span key={recipe.name}>
              <Link
                href={recipe.href}
                className={`text-black no-underline font-normal hover:text-gray-600 transition-colors ${
                  recipe.italic ? "italic" : ""
                }`}
              >
                {recipe.name}
              </Link>
              {index < recipes.length - 1 && (
                <span className="text-black font-normal"> / </span>
              )}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
