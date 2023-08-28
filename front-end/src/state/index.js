import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "dark",
    user: null,
    token: null,
    posts: []
}

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark": "light"
        },
        setLogin:  (state, action) => {
            console.log('ACTION::LOGIN', action)
            
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setPosts: (state, action) => {
            if (action.payload.posts?.length) {
                state.posts = action.payload.posts;
            } else {
                console.error('Error in posts', action.payload)
            }
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) return action.payload.post
                return post
            })
            state.posts = updatedPosts
        },
        setFriends: (state, action) => {
            if (state.user && action.payload.friends?.length) {
                console.log('ACTION::', action)
                state.user.friends = action.payload.friends
            } else {
                console.error("User friends non existens :)")
            }
        }
    }
})

export const {setFriends, setLogin, setLogout, setMode, setPost, setPosts} = authSlice.actions
export default authSlice.reducer