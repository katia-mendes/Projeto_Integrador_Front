import { Link } from "react-router-dom"
import Produto from "../../../models/Produto"
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

interface CardProdutosProps {
    post: Produto
}


function CardProdutos({post}: CardProdutosProps) {
    const { usuario } = useContext(AuthContext)

    return (
        <div className="border-slate-900 flex flex-col roundend overflow-hidden justify-between">
            <div>
                <div className="flex w-full bg-verde-leve py-2 px-4 items-center gap-4">
                    <img src= "https://docs.google.com/uc?id=1t6jWYttF6px5A6m1G5lboD8kPAD3mRgT" className="h-12 rounded-full" alt="Imagem do usuário" />
                    <h3 className="text-lg font-bold text-center uppercase">{post.usuario?.nomeCompleto}:</h3>
                </div>
                <div className='p-4 '>
                    <h4 className='text-lg font-semibold uppercase'>{post.nome}</h4>
                    <p>{post.descricao}:</p>
                    <p>{post.valor}</p>
                    <p>{post.quantidade}</p>
                    <p>{post.vendedor}</p>
                    <p>Categoria: {post.categorias?.tipo} </p>
                </div>
            </div>
            {usuario.id === post.usuario?.id ? (
                <div className="flex">
                <Link to={`/editarProduto/${post.id}`} className="w-full text-white bg-verde-leve hover:bg-maio-verde flex items-center justify-center py-2">
                    <button>Editar</button>
                </Link>
                <Link to={`/deletarProduto/${post.id}`} className="text-white bg-castanha-profunda hover:bg-red-700 w-full flex items-center justify-center py-2">
                    <button>Deletar</button>
                </Link>
            </div>
            ):(<p></p>)}
            

        </div>
    )
}

export default CardProdutos