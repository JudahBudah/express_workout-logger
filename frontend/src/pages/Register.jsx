import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', { username, email, password })
      navigate('/')
    } catch (err) {
      setError('Registration failed')
    }
  }
  
  return (
    <div className='min-h-screen bg-zinc-900 flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        <div className='bg-zinc-800 rounded-2xl p-8 shadow-xl border border-zinc-700'>
          <h1 className='text-white text-xl font-bold mb-6'>Register</h1>

          {error && <p className='bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6'>{error}</p>}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='text-zinc-400 text-sm mb-1 block'>Username</label>
              <input
                type='text'
                placeholder='John Doe'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors'
              />
            </div>
            <div>
              <label className='text-zinc-400 text-sm mb-1 block'>Email</label>
              <input
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors'
              />
            </div>
            <div className='w-full'>
              <label className='text-zinc-400 text-sm mb-1 block'>Password</label>
              <input
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors'
              />
            </div>

            <button type='submit' className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors mt-2 cursor-pointer'>
              Register
            </button>
          </form>
          <p className='text-zinc-500 text-sm text-center mt-6'>Already a user?
            <a onClick={() => navigate('/')}  className='text-orange-400 hover:text-orange-300 ml-1 font-medium cursor-pointer'>
              Sign-in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register