import axios from "axios"
import { endpoints } from "@/api/endpoints"

export type SignInInput = {
  email: string
  password: string
}

export type SignUpInput = {
  name: string
  email: string
  password: string
  role?: "ADMIN" | "MEMBER"
}

export const signIn = async (payload: SignInInput) => {
  const response = await axios.post(endpoints.signIn, payload)
  return response.data
}

export const signUp = async (payload: SignUpInput) => {
  const response = await axios.post(endpoints.signUp, payload)
  return response.data
}
