import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doTick, incDragon, incScience } from "~/redux/game";
import { RootState } from "~/redux/store";
import Image from "next/image";

const SciencePanel: React.FC = () => {
  const { science } = useSelector((state: RootState) => state.game);

  return (
    <div className="flex h-full w-1/2 flex-col items-center justify-center">
      <h2 className="text-2xl">Science</h2>
      <div className="text-4xl">{science}</div>
    </div>
  );
};

const DragonPanel: React.FC = () => {
  const { dragon } = useSelector((state: RootState) => state.game);

  return (
    <div className="flex h-full w-1/2 flex-col items-center justify-center">
      <h2 className="text-2xl">Dragon</h2>
      <div className="text-4xl">{dragon}</div>
    </div>
  );
};

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

const ScienceButton: React.FC = () => {
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
      <div className="ml-4 mt-0 inline-block inline">
        <div className="absolute z-10">
          <button
            className="transform rounded bg-transparent py-2 px-4 font-bold text-white transition-all duration-200 ease-in-out hover:scale-110"
            onClick={() => {
              dispatch(incScience());
              const theta = Math.random() * Math.PI * 2;
              const vel = {
                x: Math.cos(theta) * 10,
                y: Math.sin(theta) * 10,
              };
              const randomOffsetX = Math.random() * 100 - 50;
              const randomOffsetY = Math.random() * 100 - 50;
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
            <Image
              src="/flask.svg"
              width={70}
              height={70}
              alt="Flask"
              style={{ transform: "translateY(-5px)" }}
            />
          </button>
        </div>
        {flying.map((f) => (
          <div
            key={`${f.pos.x},${f.pos.y}`}
            className="absolute"
            style={{
              transform: `rotate(${f.theta}rad) translate(${f.pos.x}px, ${f.pos.y}px)`,
            }}
          >
            <Image
              src="/flask.svg"
              width={70 * (f.framesLeft / 60)}
              height={70 * (f.framesLeft / 60)}
              alt="Flask"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const DragonButton: React.FC = () => {
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
      <div className="ml-4 mt-0 inline-block inline">
        <div className="absolute z-10">
          <button
            className="transform rounded bg-transparent py-2 px-4 font-bold text-white transition-all duration-200 ease-in-out hover:scale-110"
            onClick={() => {
              dispatch(incDragon());
              const theta = Math.random() * Math.PI * 2;
              const vel = {
                x: Math.cos(theta) * 10,
                y: Math.sin(theta) * 10,
              };
              const randomOffsetX = Math.random() * 100 - 50;
              const randomOffsetY = Math.random() * 100 - 50;
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
            <Image src="/dragon.svg" width={100} height={100} alt="Dragon" />
          </button>
        </div>
        {flying.map((f) => (
          <div
            key={`${f.pos.x},${f.pos.y}`}
            className="absolute"
            style={{
              transform: `rotate(${f.theta}rad) translate(${f.pos.x}px, ${f.pos.y}px)`,
            }}
          >
            <Image
              src="/dragon.svg"
              width={100 * (f.framesLeft / 60)}
              height={100 * (f.framesLeft / 60)}
              alt="Dragon"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Game: React.FC = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      doTick();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { dragon, science } = useSelector((state: RootState) => state.game);

  const dispatch = useDispatch();

  return (
    <div className="flex h-full w-full flex-row items-center justify-center">
      <SciencePanel />
      <ScienceButton />
      <DragonButton />
      <DragonPanel />
    </div>
  );
};

export default Game;
