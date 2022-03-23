import jsCookie from 'js-cookie'
import { createContext, useReducer } from 'react'
export const Store = createContext()
const initialState = {
    userInfo: jsCookie.get('userInfo') ? JSON.parse(jsCookie.get('userInfo')) : null,
    defaultProfilePic: "https://firebasestorage.googleapis.com/v0/b/social-media-app-97c1d.appspot.com/o/defaults%2Fprofile_pic.jpg?alt=media&token=3af3f83d-6cad-4b4d-8160-b2749bb41303",
    defaultBanner:"https://firebasestorage.googleapis.com/v0/b/social-media-app-97c1d.appspot.com/o/defaults%2Fbanner_image.png?alt=media&token=5d4a4548-53c3-4ec4-9951-c1b8338bd6a5"
}

function reducer(state, action) {
    switch (action.type) {
        case "LOGIN": {
            return { ...state, userInfo: action.payload }
        }

        case "LOGOUT": {
            return { ...state, userInfo: null }
        }
        default:
            return state
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const value = { state, dispatch }
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}