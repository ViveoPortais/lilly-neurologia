import { Button } from "../ui/button";
import { HiX } from "react-icons/hi";
import { motion } from "framer-motion";

interface ModalExternalRedirectProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ModalExternalRedirect = ({
    isOpen,
    onClose,
    onConfirm,
}: ModalExternalRedirectProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] px-6 py-6 break-words whitespace-normal"
            >
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-zinc-300">
                    <h2 className="text-xl text-zinc-800">
                        Confirmação de redirecionamento
                    </h2>

                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-7 h-7 rounded-full border border-zinc-500 bg-white hover:bg-zinc-100 transition"
                    >
                        <HiX className="text-zinc-700 text-lg" />
                    </button>
                </div>

                <p className="text-black text-base text-left mb-10 break-words text-zinc-800 text-[15px] leading-normal">
                    Agora você está deixando um site Lilly e sendo redirecionado para um
                    site externo. As informações e administração do conteúdo não são de
                    responsabilidade da Eli Lilly LTDA.
                </p>

                <p className="text-black text-base text-left mb-10 break-words text-zinc-800 text-[15px] leading-normal">
                    Clique em "Concordo" para seguir ao site externo ou em "Discordo" para
                    fechar esta janela e retornar ao Lilly Melhor Para Você.
                </p>

                <div className="flex gap-3">
                    <Button
                        variant={"default"}
                        className="w-full border border-[#D9261C] hover:bg-[#c01f16] text-white font-medium text-base py-5"
                        onClick={onConfirm}
                    >
                        Concordo
                    </Button>

                    <Button
                        variant={"outlineMainlilly"}
                        className="w-full border border-[#D9261C] text-[#D9261C] font-medium text-base py-5 hover:bg-red-50"
                        onClick={onClose}
                    >
                        Discordo
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default ModalExternalRedirect;