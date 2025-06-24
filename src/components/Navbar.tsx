import { Link, useRouter } from '@tanstack/react-router'

export const Navbar = () => {
  const router = useRouter()
  const currentPath = router.state.location.pathname

  const navItems = [
    { name: 'Workspace', path: '/workspace' },
    { name: 'Buyers', path: '/master/buyers' },
    { name: 'Sellers', path: '/master/sellers' },
  ]

  return (
    <nav className="w-full h-14 bg-white border-b shadow-sm flex items-center px-6">
      <div className="text-xl font-bold mr-10">Invoice Extractor</div>
      <ul className="flex space-x-6 text-gray-700 font-medium">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`transition-colors duration-200 hover:text-blue-500 ${
                currentPath === item.path ? 'text-blue-500' : ''
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
