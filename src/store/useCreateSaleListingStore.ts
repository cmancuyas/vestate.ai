// src/store/useCreateListingStore.ts
import { create } from 'zustand'

type CreateListingState = {
  address: string
  finalPrice: string
  closingDate: string
  buyerName: string
  sellerName: string
  sellerAgent: string
  commission: string
  setField: (field: keyof CreateListingState, value: string) => void
  uploadedFiles: { file: File; label: string; keyPrefix: string }[]
  addFile: (file: File, label: string, keyPrefix: string) => void
  clearFiles: () => void
}

export const useCreateListingStore = create<CreateListingState>((set) => ({
  address: '',
  finalPrice: '',
  closingDate: '',
  buyerName: '',
  sellerName: '',
  sellerAgent: '',
  commission: '',
  setField: (field, value) => set({ [field]: value }),
uploadedFiles: [],
addFile: (file, label, keyPrefix) =>
  set((state) => ({
    uploadedFiles: [...state.uploadedFiles, { file, label, keyPrefix }]
  })),
clearFiles: () => set({ uploadedFiles: [] }),
}))
