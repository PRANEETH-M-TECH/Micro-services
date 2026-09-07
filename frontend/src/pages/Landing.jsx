import { Link } from 'react-router-dom';

const heroImages = [
  '/hero/01-aerial-society.jpg',
  '/hero/02-zoom-block.jpg',
  '/hero/03-floor-clothes.jpg',
  '/hero/04-floor-food.jpg',
];

export default function Landing() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0 -z-20">
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="hero-slide absolute inset-0 h-full w-full object-cover"
            style={{ animationDelay: `${i * 3}s` }}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-darker/80 via-primary-darker/50 to-primary-darker/90" />

      <h1 className="text-5xl font-bold text-white">Communa</h1>
      <p className="mt-4 max-w-md text-mint">
        Your society's own marketplace — discover and connect with neighbors offering food,
        clothing, essentials, services and tuitions.
      </p>
      <Link
        to="/login"
        className="mt-8 rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-dark"
      >
        Enter Community
      </Link>
    </div>
  );
}
