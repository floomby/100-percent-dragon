const Panel: React.FC<{text: string, count: number}> = ({text, count}) => {
  return (
    <div className="flex h-full w-1/2 flex-col items-center justify-center">
      <h2 className="text-2xl">{text}</h2>
      <div className="text-4xl">{count}</div>
    </div>
  );
};

export default Panel;