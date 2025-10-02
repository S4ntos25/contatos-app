import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Contact = {
  id: string
  nome: string
  email: string
  telefone: string
}

export type ContactsState = {
  list: Contact[]
  editingId: string | null
}

const initialState: ContactsState = {
  list: [],
  editingId: null
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<Omit<Contact, 'id'>>) => {
      const id = crypto.randomUUID()
      state.list.push({ id, ...action.payload })
    },
    removeContact: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((c) => c.id !== action.payload)
    },
    startEditing: (state, action: PayloadAction<string>) => {
      state.editingId = action.payload
    },
    cancelEditing: (state) => {
      state.editingId = null
    },
    updateContact: (
      state,
      action: PayloadAction<{ id: string; nome: string; email: string; telefone: string }>
    ) => {
      const idx = state.list.findIndex((c) => c.id === action.payload.id)
      if (idx >= 0) {
        state.list[idx] = { ...state.list[idx], ...action.payload }
        state.editingId = null
      }
    }
  }
})

export const { addContact, removeContact, startEditing, cancelEditing, updateContact } =
  contactsSlice.actions
export default contactsSlice.reducer