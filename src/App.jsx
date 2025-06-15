"use client"
import { useState } from "react"
import LoginPage from "./components/LoginPage"
import SignupPage from "./components/SignupPage"
import "./index.css"

function App() {
  const [navigationStack, setNavigationStack] = useState([{ page: "login" }])
  const currentPage = navigationStack[navigationStack.length - 1]
  const navigateTo = (page, data = {}) => {
    setNavigationStack((prev) => [...prev, { page, ...data }])
  }
  const navigateBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack((prev) => prev.slice(0, -1))
    }
  }
  const navigateReplace = (page, data = {}) => {
    setNavigationStack((prev) => [...prev.slice(0, -1), { page, ...data }])
  }
  const navigationProps = {
    navigateTo,
    navigateBack,
    navigateReplace,
    canGoBack: navigationStack.length > 1,
    currentPage: currentPage.page,
  }
  const renderPage = () => {
    switch (currentPage.page) {
      case "login":
        return <LoginPage {...navigationProps} />
      case "signup":
        return <SignupPage {...navigationProps} pageData={currentPage} />
      default:
        return <LoginPage {...navigationProps} />
    }
  }
  return <div className="App">{renderPage()}</div>
}

export default App
