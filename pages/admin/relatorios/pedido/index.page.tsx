import { NextPage } from 'next';
import { useMutation, useQuery } from 'react-query';
import { clienteService } from '../../../../services';
import { Container, Content, Orderless, TableContainer, LoadingOrders } from './pedido';
import { useState } from 'react';
import { pedidoService } from '../../../../services/index';
import toast from 'react-hot-toast';
import { Loading } from '@nextui-org/react';
import Image from "next/image";
import BloomImg from '../../../../assets/bloom.png'
import OrderInfo from '../../../../components/Modal/OrderInfo/index.page';
import Head from 'next/head';
import { format } from 'date-fns';

interface Pedido {
  id: number;
  dataCriacao: Date;
  dataEntrega: Date;
  valorTotal: number;
  status: string;
  observacao: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  telefone: string;
}

const Pedidos: NextPage = () => {
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pedidoId, setPedidoId] = useState(0)
  const [pedido, setPedido] = useState<Pedido>({ id: 0, dataCriacao: new Date(), dataEntrega: new Date(), valorTotal: 0, status: '', observacao: '', nome: '', endereco: '', cidade: '', estado: '', telefone: '' })

  const mutation = useMutation(pedidoService.listarPedidoByIdRq)
  
  const handlePedidoByIdSearch = async () => {
    await mutation.mutateAsync(pedidoId , {
      onSuccess: async (data) => {
        setPedido(data.pedido[0])
      },
      onError: async (error) => {
        toast.error('Erro ao pesquisar os produtos nessa data.')
        console.error(error)
      }
    })
  }

  const onRequestClose = async () => {
    setIsModalOpen(false)
  }

  const viewOrderInfo = async (pedido: Pedido) => {
    setPedido(pedido)
    setIsModalOpen(true)
  }

  return (
    <>
      <Head>
        <title>Pedidos por ID</title>
      </Head>
      <Container>
        <Content>
          <header>
            <h1>Pedidos por Cliente</h1>
            <p>Selecione o Cliente para ver os seus pedidos.</p>
          </header>
          <section>
            <input type="text" placeholder="Pesquise por ID" 
                onChange={event => {setPedidoId(Number(event.target.value))}} 
            />
            <button onClick={handlePedidoByIdSearch}>
              Selecionar
            </button>
          </section>
        </Content>
        {isOrdersLoading && (
          <>
            <LoadingOrders>
              <Loading type='points'>Carregando pedido</Loading> 
            </LoadingOrders>          
          </>
        )}
        {pedido.id === 0 ? (
          <>
            <Orderless>
              <h1>Procura um pedido pelo seu ID!</h1>  
            </Orderless>          
          </>
        ) : (
          <>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Data Criação</th>
                    <th>Status</th>
                    <th>Data Entrega</th>
                    <th>Valor Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>            
                  <tr key={pedido.id}>
                    <td>{pedido.id}</td>
                    <td>{pedido.nome}</td>
                    <td>{format(new Date(pedido.dataCriacao), 'dd/MM/yyyy')}</td>
                    <td>{pedido.status}</td>
                    <td>{pedido.dataEntrega ? format(new Date(pedido.dataEntrega), 'dd/MM/yyyy') : 'Sem Data'}</td>
                    <td>{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(pedido.valorTotal)}</td>
                    <td>
                      <a><Image onClick={() => {viewOrderInfo(pedido)}} src={BloomImg} alt="Visualizar" width={30} height={30} /></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </TableContainer>
          </>
        )}
      </Container>
      <OrderInfo isOpen={isModalOpen} onRequestClose={onRequestClose} pedido={pedido}/>
    </>
  )
}

export default Pedidos