import axios from "axios"
import { getCookie } from "./cookie-handler"

const getToken = () => {  
  return getCookie("kanplan_token")  
}

const url = process.env.REACT_APP_API_URL || "https://www.danieloliveira.net.br/KanPlan.API/api/";

export const api = axios.create({
  baseURL: url
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