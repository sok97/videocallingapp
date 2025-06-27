import {create} from 'zustand'
export const useThemeStore = create((set) => ({
theme : localStorage.getItem("mytheme")||"coffee",
setTheme : (theme) => {
    set({theme})
    localStorage.setItem("mytheme",theme)
},
}))