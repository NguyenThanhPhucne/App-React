import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "../features/userSlice"

function ProtectedRoute({ children }) {
  const user = useSelector(selectUser)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
