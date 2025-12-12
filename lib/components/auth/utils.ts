import { betterAuth } from "better-auth"
import { authClient } from "./auth-client"

export const signIn = async () => {
  try {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/home`,
      errorCallbackURL: `${window.location.origin}/`,
    })
    console.log("Sign in successful:", data)
    return data
  } catch (error) {
    console.error("Sign in error:", error)
    throw error
  }
}

export const signOut = async () => {
  try {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/" 
        }
      }
    })
  } catch (error) {
    console.error("Sign out error:", error)
    throw error
  }
}

export const checkClientAuth = async () => {
  const { error } = await authClient.getSession()
  if (error){
    window.location.href = "/"
    return null
  }
}
