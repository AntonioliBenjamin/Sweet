import axios from "axios";



export function resetPassword(password, token) {
console.log(password,token)
    axios({
        method: 'post',
        url: 'http://localhost:3005/user/resetpassword',
        headers: {},
        data: {
            password: password,
            token: token
        }
    })
        .catch(error => console.error(error))
}