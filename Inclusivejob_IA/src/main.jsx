import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId="128233628072-7ds5mnsr3od6unpukot51dco8o4lstog.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
)