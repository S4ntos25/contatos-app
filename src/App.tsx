import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import type { RootState } from './store'
import { addContact, removeContact, startEditing, cancelEditing, updateContact } from './features/contactsSlice'
import { useState } from 'react'

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
`

const Title = styled.h1`
  margin-bottom: 16px;
`

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 8px;
  margin-bottom: 24px;

  input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }

  button {
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    background: #1e88e5;
    color: #fff;
    cursor: pointer;
  }
`

const List = styled.ul`
  list-style: none;
  padding: 0;
`

const Item = styled.li`
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr auto;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
`

const SmallButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: #455a64;
  color: #fff;
  cursor: pointer;
  margin-left: 8px;

  &.danger {
    background: #e53935;
  }

  &.success {
    background: #43a047;
  }
`

function App() {
  const dispatch = useDispatch()
  const contacts = useSelector((state: RootState) => state.contacts.list)
  const editingId = useSelector((state: RootState) => state.contacts.editingId)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  const [editNome, setEditNome] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editTelefone, setEditTelefone] = useState('')

  function onAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!nome || !email || !telefone) return
    dispatch(addContact({ nome, email, telefone }))
    setNome('')
    setEmail('')
    setTelefone('')
  }

  function onStartEdit(id: string, current: { nome: string; email: string; telefone: string }) {
    dispatch(startEditing(id))
    setEditNome(current.nome)
    setEditEmail(current.email)
    setEditTelefone(current.telefone)
  }

  function onConfirmEdit(id: string) {
    if (!editNome || !editEmail || !editTelefone) return
    dispatch(updateContact({ id, nome: editNome, email: editEmail, telefone: editTelefone }))
  }

  return (
    <Container>
      <Title>Lista de Contatos</Title>

      <Form onSubmit={onAdd}>
        <input placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <button type="submit">Adicionar</button>
      </Form>

      <List>
        {contacts.map((c) => (
          <Item key={c.id}>
            {editingId === c.id ? (
              <>
                <input value={editNome} onChange={(e) => setEditNome(e.target.value)} />
                <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                <input value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} />
                <div>
                  <SmallButton className="success" onClick={() => onConfirmEdit(c.id)}>
                    Salvar
                  </SmallButton>
                  <SmallButton onClick={() => dispatch(cancelEditing())}>Cancelar</SmallButton>
                </div>
              </>
            ) : (
              <>
                <span>{c.nome}</span>
                <span>{c.email}</span>
                <span>{c.telefone}</span>
                <div>
                  <SmallButton onClick={() => onStartEdit(c.id, c)}>Editar</SmallButton>
                  <SmallButton className="danger" onClick={() => dispatch(removeContact(c.id))}>
                    Remover
                  </SmallButton>
                </div>
              </>
            )}
          </Item>
        ))}
      </List>
    </Container>
  )
}

export default App