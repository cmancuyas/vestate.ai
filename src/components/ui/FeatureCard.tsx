// src/components/ui/FeatureCard.tsx
export default function FeatureCard({
  title,
  description,
  image,
}: {
  title: string
  description: string
  image: string
}) {
  return (
    <div className="rounded-xl overflow-hidden shadow bg-white dark:bg-gray-900 border dark:border-gray-800 transition">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">{title}</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
      </div>
    </div>
  )
}