import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Login, { action as loginAction } from './pages/Login'
import Signup, { action as signupAction } from './pages/Signup'
import { AuthContextProvider } from './contexts/AuthContext'

const router = 
    createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<App/>}>
          <Route index element={<Home/>}/>
          <Route path="/signup" element={<Signup/>} action={signupAction}/>
          <Route path="/login" element={<Login/>} action={loginAction}/>
        </Route>
      )
    )

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
)
