"use client"

import { useAuth } from "@/context/auth-context"

const CBSPage = () => {
  const auth = useAuth()
  console.log(auth?.currentUser);
  

  return (
    <div>
      {auth?.currentUser?.email}
    </div>
  )
}

export default CBSPage