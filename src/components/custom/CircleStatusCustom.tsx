type CircleStatusCustomProps = {
    color: string;
};

const CircleStatusCustom = ({color} : CircleStatusCustomProps) => {
    return (
        <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${color}`} />
        </div>
      );
  };
  
  export default CircleStatusCustom;