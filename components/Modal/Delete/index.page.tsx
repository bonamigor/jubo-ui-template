
import Modal from 'react-modal'
import { NextPage } from "next";
import { clienteService, produtoService } from '../../../services';
import toast from 'react-hot-toast';
import { Buttons, Container, Content } from './delete';
import { usuarioService, estanteService, pedidoService, itemPedidoService, produtoEstanteService } from '../../../services/index';
import { useUser } from '../../../hooks/useUser';
import { useRouter } from 'next/router';

interface DeleteModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  entity: string;
  id?: number;
  idArray?: Array<number>;
}

const DeleteModal: NextPage<DeleteModalProps> = ({ isOpen, onRequestClose, entity, id = 0, idArray = [0, 0] }: DeleteModalProps) => {
  const { user, logoutUser } = useUser()
  const router = useRouter()

  const handleDelete = async () => {
    switch(entity) {
      case 'Cliente':
        const { clienteErrors } = await clienteService.deletarCliente(id)

        if(!clienteErrors) {
          onRequestClose()
          toast.success('Cliente excluído com sucesso!')
          router.reload()
        } else {
          toast.error('Erro ao excluir o cliente.')
        }
        break;
      case 'Usuario':
        const { userErrors } = await usuarioService.deletarUsuario(id)

        if(!userErrors) {
          onRequestClose()
          toast.success('Usuário excluído com sucesso!')
          if (id === user.id) {
            window.localStorage.removeItem('token')
            window.sessionStorage.removeItem('userId')
            window.sessionStorage.removeItem('userName')
            window.sessionStorage.removeItem('userEmail')
            window.sessionStorage.removeItem('userAdmin')
            logoutUser()
            router.push('/')
          }
          router.reload()
        } else {
          toast.error('Erro ao excluir o Usuário.')
        }
        break;
      
      case 'Produto':
        const { produtoErrors } = await produtoService.deletarProduto(id)
        if (!produtoErrors) {
          onRequestClose()
          toast.success('Produto excluído com sucesso!')
          router.reload()
        } else {
          toast.error('Erro ao excluir o Produto.')
        }
        break;

      case 'Estante':
        const { estanteErrors } = await estanteService.deletarEstante(id)
        if (!estanteErrors) {
          onRequestClose()
          toast.success('Estante excluída com sucesso!')
          router.reload()
        } else {
          toast.error('Erro ao excluir a Estante.')
        }
        break;

      case 'Pedido':
        const { pedidoErrors } = await pedidoService.deletarPedidoById(id)
        if (!pedidoErrors) {
          onRequestClose()
          toast.success('Pedido excluído com sucesso!')
          router.push('/cliente/inicial')
        } else {
          toast.error('Erro ao excluir o Pedido.')
        }
        break;

      case 'ItemPedido':
        const { itemPedidoErrors } = await itemPedidoService.deletarProdutoDoPedidoById(id)
        if (!itemPedidoErrors) {
          onRequestClose()
          toast.success('Item excluído do Pedido com sucesso!')
        } else {
          toast.error('Erro ao excluir o Item do Pedido.')
        }
        break;

      case 'ProdutoEstante':
        const { produtoEstanteErrors } = await produtoEstanteService.deletarProdutoDaEstante({
          idEstante: idArray[0],
          idProduto: idArray[1]
        })

        if (!produtoEstanteErrors) {
          onRequestClose()
          toast.success('Produto excluído da Estante com sucesso!')
        } else {
          toast.error('Erro ao excluir o produto da Estante.')
        }
        break;
    }
  }

  return(
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayClassName="react-modal-overlay"
        className="react-modal-content"
      >
        <Container>
          <Content>
            <h2>Deseja mesmo excluir esse registro?</h2>
            <Buttons>
              <button type='button' onClick={() => handleDelete()}>Excluir</button>
              <button type='button' className='no' onClick={onRequestClose}>Não</button>
            </Buttons>
          </Content>
        </Container>
      </Modal>
    </>
  )
}

export default DeleteModal