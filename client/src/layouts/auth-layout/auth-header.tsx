import Logo from '@/components/logo'

function AuthHeader() {
  return (
    <header className="py-6">
      <div className="container">
        <nav className="flex items-center">
          <Logo />
        </nav>
      </div>
    </header>
  )
}

export default AuthHeader
