import create from 'zustand';


const useStore = create((set) => ({
    data: "Hello World",
    updatedData: (newData) => set({data: newData})
}))