import axios from "axios"
const baseUrl = process.env.REACT_APP_BASE_URL;
console.log(baseUrl)

const instance = axios.create({
    baseURL:`${baseUrl}/api`
})
export default instance