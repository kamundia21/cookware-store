import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function Guides() {
  const guides = [
    { id: 'beginner', title: "The Beginner's Kitchen", desc: "Essential tools and techniques for starting your culinary journey", img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
    { id: 'baking', title: "Essential Baking Tools", desc: "Everything you need to create perfect pastries and breads", img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400' },
    { id: 'induction', title: "Induction Cooking Guide", desc: "Our top picks for induction-compatible cookware", img: 'https://images.unsplash.com/photo-1556909123-3783a03e9996?w=400' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <BookOpen className="h-10 w-10 text-orange-500" />
        Cooking Guides
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map(guide => (
          <Link key={guide.id} to={`/guides/${guide.id}`} className="group bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden">
            <img src={guide.img} alt={guide.title} className="w-full h-48 object-cover group-hover:scale-105 transition" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{guide.title}</h2>
              <p className="text-gray-600">{guide.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}