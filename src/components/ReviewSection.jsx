import { useState } from 'react';
import { Star } from 'lucide-react';

export function ReviewSection({ product }) {
  const [reviews] = useState([
    {
      id: 1,
      author: "Sarah M.",
      rating: 5,
      date: "2024-01-15",
      title: "Best purchase ever!",
      content: "This completely transformed my cooking experience. Heat distribution is perfect."
    },
    {
      id: 2,
      author: "John K.",
      rating: 4,
      date: "2024-01-10",
      title: "Great quality, worth the price",
      content: "Solid construction, exactly as described. Took one star off because it's heavy."
    }
  ]);

  // Provide defaults for product properties that may not exist
  const productRating = product?.rating || 4.5;
  const productReviews = product?.reviews || reviews.length;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <div className="flex items-center gap-4 mb-8">
        <div className="text-4xl font-bold">{productRating}</div>
        <div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-6 w-6 ${i < Math.floor(productRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-gray-600">Based on {productReviews} reviews</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex justify-between mb-2">
              <div>
                <p className="font-semibold">{review.author}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <span className="text-gray-500 text-sm">{review.date}</span>
            </div>
            <h4 className="font-bold mb-2">{review.title}</h4>
            <p className="text-gray-700">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}