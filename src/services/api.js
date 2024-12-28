import axios from "axios"
import { getCookie } from "./cookie-handler"

const getToken = () => {  
  return getCookie("kanplan_token")  
}

export const api = axios.create({
  baseURL: "https://www.danieloliveira.net.br/KanPlan.API/api/"
})

api.interceptors.request.use((request) => {
    headersWithBearer(request)
    return request
})

const headersWithBearer = (request) => {
  return (request.headers = {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  })
}