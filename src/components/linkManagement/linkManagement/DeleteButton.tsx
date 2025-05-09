type DeleteButtonProps = {
    onClick?: () => void;
  };
  
  const DeleteButton = ({ onClick }: DeleteButtonProps) => {
    return (
      <button
        onClick={onClick}
        className="px-3 py-1 border border-red-500 text-red-600 rounded-full text-sm font-semibold hover:bg-red-50"
      >
        Excluir
      </button>
    );
  };
  
  export default DeleteButton;