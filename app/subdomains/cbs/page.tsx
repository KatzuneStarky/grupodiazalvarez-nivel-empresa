"use client"

import { useAuth } from "@/context/auth-context"

const CBSPage = () => {
  const auth = useAuth()

  return (
    <div>
      {auth?.currentUser?.email}
    </div>
  )
}

export default CBSPage