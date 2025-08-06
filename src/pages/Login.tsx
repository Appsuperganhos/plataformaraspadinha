import React from 'react'
import Header from '../components/Header'
import LoginForm from '../components/LoginForm'

export default function Login() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1a1a1a]">
        <LoginForm />
      </div>
    </>
  )
}
