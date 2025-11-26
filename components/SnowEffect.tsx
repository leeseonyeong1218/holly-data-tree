
import React, { useEffect, useState } from 'react';

const SnowEffect: React.FC = () => {
  const [flakes, setFlakes] = useState<any[]>([]);

  useEffect(() => {
    // Generate 50 snowflakes with random properties
    const newFlakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      animationDuration: Math.random() * 5 + 5 + 's', // 5s to 10s
      animationDelay: Math.random() * 5 + 's',
      opacity: Math.random() * 0.7 + 0.3,
      size: Math.random() * 4 + 2 + 'px'
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) translateX(0); }
          100% { transform: translateY(110vh) translateX(20px); }
        }
      `}</style>
      {flakes.map(flake => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full blur-[1px]"
          style={{
            left: flake.left,
            top: '-10px',
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animation: `fall ${flake.animationDuration} linear infinite`,
            animationDelay: flake.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default SnowEffect;
