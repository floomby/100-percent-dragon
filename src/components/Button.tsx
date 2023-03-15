import { type ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Image from "next/image";

type Vec2 = {
  x: number;
  y: number;
};

type FlyingSvg = {
  pos: Vec2;
  vel: Vec2;
  omega: number;
  theta: number;
  framesLeft: number;
};

const Button: React.FC<{
  handler: ActionCreatorWithoutPayload<"gameSlice/incScience" | "gameSlice/incDragon">;
  imgPath: string;
  imgAlt: string;
}> = ({ handler, imgPath, imgAlt }) => {
  const dispatch = useDispatch();

  const [flying, setFlying] = useState<FlyingSvg[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlying((prev) => {
        const next = prev.map((f) => {
          if (f.framesLeft <= 0) {
            return f;
          }
          return {
            ...f,
            pos: {
              x: f.pos.x + f.vel.x,
              y: f.pos.y + f.vel.y,
            },
            framesLeft: f.framesLeft - 1,
            theta: f.theta + f.omega,
            // apply gravity
            vel: {
              x: f.vel.x,
              y: f.vel.y + 0.1,
            },
          };
        });
        return next.filter((f) => f.framesLeft > 0);
      });
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="basis-1/4">
      <div className="mt-0 inline-block">
        <div>
          <button
            className="transform rounded bg-transparent py-2 px-4 font-bold text-white transition-all duration-200 ease-in-out hover:scale-110"
            onClick={() => {
              dispatch(handler());
              const theta = Math.random() * Math.PI * 2;
              const vel = {
                x: Math.cos(theta) * 5,
                y: Math.sin(theta) * 5,
              };
              const randomOffsetX = Math.random() * 70 - 35;
              const randomOffsetY = Math.random() * 70 - 35;
              const omega = Math.random() * 0.1 - 0.05;
              const randomTheta = Math.random() * Math.PI * 2;
              setFlying((prev) => [
                ...prev,
                {
                  pos: { x: 0 + randomOffsetX, y: 0 + randomOffsetY },
                  vel,
                  omega,
                  theta: randomTheta,
                  framesLeft: 60,
                },
              ]);
            }}
          >
            <Image src={imgPath} width={100} height={100} alt={imgAlt} />
          </button>
        </div>
        {flying.map((f) => (
          <div
            key={`${f.pos.x},${f.pos.y}`}
            className="absolute"
            style={{
              transform: `translate(${f.pos.x}px, ${f.pos.y - 100}px) rotate(${f.theta}rad)`,
            }}
          >
            <Image
              src={imgPath}
              width={100 * (f.framesLeft / 60)}
              height={100 * (f.framesLeft / 60)}
              alt={imgAlt}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Button;
