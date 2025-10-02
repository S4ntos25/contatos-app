import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import type { RootState } from './store'
import { addContact, removeContact, startEditing, cancelEditing, updateContact } from './features/contactsSlice'
import { useState } from 'react'
import bg from './assets/welcome-bg.svg'

const Page = styled.div`
  min-height: 100vh;
  background: url(${bg}) center/cover no-repeat fixed;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
  }
`

const Container = styled.div`
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px 48px;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  color: #fff;

  @media (max-width: 600px) {
    padding: 20px 16px 32px;
  }
`

const Title = styled.h1`
  margin-bottom: 8px;
  font-size: 28px;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 8px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    button {
      grid-column: span 2;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 10px;

    button {
      width: 100%;
      grid-column: 1;
    }
  }

  input {
    padding: 10px 12px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    ::placeholder { color: rgba(255,255,255,0.85); }
  }

  button {
    padding: 10px 12px;
    border-radius: 6px;
    border: none;
    background: #43a047;
    color: #fff;
    cursor: pointer;
    font-weight: 600;
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
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.1);

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  div {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  input {
    padding: 10px 12px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`

const SmallButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: #455a64;
  color: #fff;
  cursor: pointer;
  margin-left: 8px;

  @media (max-width: 600px) {
    padding: 10px 12px;
    margin-left: 0;
  }

  &.danger { background: #e53935; }
  &.success { background: #43a047; }
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
    <Page>
      <Container>
        <Title>Lista de Contatos</Title>

        <Form onSubmit={onAdd}>
          <input type="text" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <input type="tel" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} autoComplete="tel" />
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
    </Page>
  )
}

export default App