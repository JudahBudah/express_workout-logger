import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { MdOutlineEmail } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className='bg-zinc-900 flex items-center justify-center h-screen text-white'>
      <div className='bg-zinc-800 p-8 px-14 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4 items-center'>
        <h1 className='text-center text-3xl font-bold'>Login</h1>
        {error && <p className='text-red-600'>{error}</p>}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center w-full'>
          <div className='w-full'>
            <MdOutlineEmail className='absolute text-2xl text-zinc-400 mt-2 ml-2 z-10' />
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-zinc-700 p-2 pl-10 rounded-md outline-0 w-full relative'
            />
          </div>
          <div className='w-full'>
            <MdLockOutline className='absolute text-2xl text-zinc-400 mt-2 ml-2 z-10' />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-zinc-700 p-2 pl-10 rounded-md outline-0 w-full relative'
            />
          </div>
          <button type='submit' className='bg-orange-500 w-60 text-[1.2rem] p-1 rounded-md cursor-pointer items-center mt-2'>Login</button>
        </form>
        <p>New user?
          <a onClick={() => navigate('/register')} className='cursor-pointer text-blue-600 text-center pl-2'>
            Create an account here
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login