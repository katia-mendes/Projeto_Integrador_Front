import { ChangeEvent, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RotatingLines } from "react-loader-spinner"

import { atualizar, buscar, cadastrar } from "../../../services/Service"
import { AuthContext } from "../../../contexts/AuthContext"

import Categoria from "../../../models/Categoria"

function FormularioCategoria() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria);

    const { id } = useParams<{ id: string }>();

    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    async function buscarPorId(id: string) {
        try {
            await buscar("/categorias/${id}", setCategoria, {
                headers: {
                    Authorization: token
                }
            })
        } catch (error: any) {
            if (error.toString().includes('403')) {
                alert('O token experiou, favor logar novamente')
                handleLogout()
            }
        }
    }

    //comentario

    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado');
            navigate('/login')
        }
    }, [token]);

    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id)
        }
    }, [id])

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setCategoria({
            ...categoria,
            [e.target.name]: e.target.value
        })
    }

    async function gerarNovaCategoria(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        if (id !== undefined) {
            try {
                await atualizar("/categorias", categoria, setCategoria, {
                    headers: {
                        Authorization: token
                    }
                })

                alert('Categoria atualizado com sucesso!')

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    alert('O token expirou, favor logar novamente')
                    handleLogout()
                } else {
                    alert('Erro ao atualizar Categoria')
                }
            }
        } else {
            try {
                await cadastrar("/categorias", categoria, setCategoria, {
                    headers: {
                        Authorization: token
                    }
                })

                alert('Categoria cadastrada com sucesso')

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    alert('O token experiou, favor logar novamente')
                    handleLogout()
                } else {
                    alert('Erro ao cadastrar Categoria')
                }
            }
        }

        setIsLoading(false)
        retornar()

    }

    function retornar() {
        navigate("/categorias")
    }

    return (
        <div className='container flex flex-col items-center justify-center mx-auto'>
            <h1 className='text-4xl text-center my-8'>
                {id === undefined ? 'Cadastrar Categoria' : 'Editar Categoria'}
            </h1>

            <form className='w-1/2 flex flex-col gap4' onSubmit={gerarNovaCategoria}>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="tipo">Descrição da Categoria</label>
                    <input
                        type="text"
                        placeholder='Descreva aqui sua categoria'
                        name='tipo'
                        className='border-2 border-slate-700 rounded p-4'
                        value={categoria.tipo}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <button className='rounded text-slate-100 bg-verde-leve hover:bg-maio-verde w-1/3 py-4 mx-auto flex justify-center my-4' type='submit'>
                    {isLoading ?
                        <RotatingLines
                            strokeColor="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="24"
                            visible={true}
                        /> :
                        <span>Confirmar</span>
                    }
                </button>
            </form>
        </div>
    )
}

export default FormularioCategoria