import { ChangeEvent, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RotatingLines } from "react-loader-spinner"

import { atualizar, buscar, cadastrar } from "../../../services/Service"
import { AuthContext } from "../../../contexts/AuthContext"

import Categoria from "../../../models/Categoria"
import { toastAlerta } from "../../../utilis/toastAlerta"

function FormularioCategoria() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria);

    const { id } = useParams<{ id: string }>();

    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    async function buscarPorId(id: string) {
        try {
            await buscar(`/categorias/${id}`, setCategoria, {
                headers: {
                    Authorization: token
                }
            })
        } catch (error: any) {
            if (error.toString().includes('403')) {
                toastAlerta('O token experiou, favor logar novamente', 'erro')
                handleLogout()
            }
        }
    }

    //comentario

    useEffect(() => {
        if (token === '') {
            toastAlerta('Você precisa estar logado', 'erro');
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

                toastAlerta('Categoria atualizado com sucesso!', 'sucesso')

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    toastAlerta('O token expirou, favor logar novamente', "erro")
                    handleLogout()
                } else {
                    toastAlerta('Erro ao atualizar Categoria', 'erro')
                }
            }
        } else {
            try {
                await cadastrar("/categorias", categoria, setCategoria, {
                    headers: {
                        Authorization: token
                    }
                })

                toastAlerta('Categoria cadastrada com sucesso', 'sucesso')

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    toastAlerta('O token experiou, favor logar novamente', 'erro')
                    handleLogout()
                } else {
                    toastAlerta('Erro ao cadastrar Categoria', 'erro')
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