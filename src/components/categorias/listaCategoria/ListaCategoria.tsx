import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Dna } from "react-loader-spinner";

import { buscar } from "../../../services/Service";
import { AuthContext } from "../../../contexts/AuthContext";

import Categoria from "../../../models/Categoria";
import CardCategoria from "../cardCategoria/CardCategoria"
import { toastAlerta } from "../../../utilis/toastAlerta";

function ListaCategoria() {
    
    const [categoria, setCategoria] = useState<Categoria[]>([]);

    // const navigate = useNavigate();

    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    async function buscarCategorias() {
        try {
            await buscar('/categorias', setCategoria, {
                headers: {
                    Authorization: token
                },
            })
        } catch (error: any) {
            if (error.toString().includes('403')) {
                toastAlerta('O token expirou, favor logar novamente', 'erro')
                handleLogout()
            }
        }
    }

    // useEffect(() => {
    //     if (token === '') {
    //         toastAlerta('VocÃª precisa estar logado', 'erro');
    //         navigate('/login');
    //     }
    // }, [token])

    useEffect(() => {
        buscarCategorias()
    }, [categoria.length])

    return (
        <>
            {categoria.length === 0 && (
                <Dna
                    visible={true}
                    height="200"
                    width="200"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper mx-auto"
                    />
            )}

            <div className="flex justify-center w-full my-4">
                <div className="container flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoria.map((categoria) => (
                            <>
                                <CardCategoria key={categoria.id} categoria={categoria} />
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListaCategoria