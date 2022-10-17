import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import User from './pages/User'
import CreateSurvey from './pages/CreateSurvey'
import EditSurvey from './pages/EditSurvey'
import { AuthContextProvider } from './contexts/AuthContext'

const router = 
    createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<App/>}>
          <Route index element={<Home/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/user" element={<User />}/>
          <Route path="/create-survey" element={<CreateSurvey />}/>
          <Route path="/edit-survey/:surveyId" element={<EditSurvey />}/>
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
