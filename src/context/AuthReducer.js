const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                isLoggedIn: true,
            };
        case "GET_TOKEN":
            return {
                ...state,
                token: action.payload,
            }
        case "GET_USER":
            return {
                ...state,
                user: action.payload,
            }
        case "UPDATE_USER":
            return {
                ...state,
                user: action.payload,
            }
        case "LOGOUT":
            return {
                ...state,
                isLoggedIn: false,
                user: [],
                token: ''
            }
        default:
            return state;
    }
}

export default AuthReducer;