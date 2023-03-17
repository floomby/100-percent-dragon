import { useEffect } from "react";
import { useSelector } from "react-redux";
import { doTick, incDragon, incScience } from "~/redux/game";
import { type RootState } from "~/redux/store";
import TechTree from "./TechTree"
import Panel from "./Panel"
import Button from "./Button"

const Game: React.FC = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      doTick();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { dragon, science } = useSelector((state: RootState) => state.game);

  return (
    <>
      <TechTree />

      <div className="flex h-full w-full flex-col md:flex-row max-w-3xl gap-4">
        <div className="flex h-full w-full flex-row items-center justify-center">
          <Panel text="Science" count={science} />
          <Button handler={incScience} imgPath="/flask.svg" imgAlt="Science" />
        </div>
        <div className="flex h-full w-full flex-row md:flex-row-reverse items-center justify-center">
          <Panel text="Dragon" count={dragon} />
          <Button handler={incDragon} imgPath="/dragon.svg" imgAlt="Dragon" />
        </div>
      </div>
    </>
  );
};

export default Game;
