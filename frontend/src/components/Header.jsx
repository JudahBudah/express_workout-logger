function Header({ onLogout }) {
  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 px-8 py-4 flex items-center justify-between'>
      <h1 className='text-2xl font-black text-white tracking-tight'>Workout Logger</h1>
      <button
        onClick={onLogout}
        className='text-zinc-400 hover:text-red-400 text-sm font-medium transition-colors cursor-pointer'
      >
        Sign Out
      </button>
    </div>
  )
}

export default Header