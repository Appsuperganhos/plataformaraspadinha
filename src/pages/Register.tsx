import React from 'react'
import Header from '../components/Header'
import RegisterForm from '../components/RegisterForm'

export default function Register() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1a1a1a]">
        <RegisterForm />
      </div>
    </>
  )
}
