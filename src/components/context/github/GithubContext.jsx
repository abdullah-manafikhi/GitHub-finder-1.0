import {createContext ,useReducer} from 'react'
import githubReducer from './GithubReducer'

const GithubContext = createContext()

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL


export const GithubProvider = ({children}) => {

    const initialState ={
        users: [],
        user:{},
        loading: false
    }

    const [state, dispatch] = useReducer(githubReducer, initialState)

    const clearUsers = () => { 
        dispatch({
            type: "CLEAR_USERS"
        })
    }

    // get search results

    const searchUsers = async (text) => {
        setLoading()
        const params = new URLSearchParams({
            q: text
        })

        const response = await fetch(`${GITHUB_URL}/search/users?${params}`)
        const {items} = await response.json()
        dispatch({
            type:"GET_USERS",
            payload: items
        })
    }


    // get user account

    const getUser = async (login) => {
        setLoading()    
        const response = await fetch(`${GITHUB_URL}/users/${login}`)
        const data = await response.json()
        dispatch({
            type:"GET_USER",
            payload: data
        })
    }

    const setLoading = () => dispatch({type:"SET_LOADING"})

    console.log(state)

    return( <GithubContext.Provider value={{
            users:state.users,
            loading:state.loading,
            user:state.user,
            getUser,
            searchUsers,
            clearUsers,
        }}>
            {children}
        </GithubContext.Provider>
    )
}

export default GithubContext