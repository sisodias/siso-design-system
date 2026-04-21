import { NavLink } from 'react-router-dom'

const links = [
  { to: '/account', label: 'Overview' },
  { to: '/account/orders', label: 'Orders' },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/account/returns', label: 'Returns' },
]

export const AccountNav = () => (
  <nav className="flex flex-col gap-1 text-sm text-semantic-text-primary/80">
    {links.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `rounded-lg px-3 py-2 transition hover:bg-semantic-legacy-brand-blush/40 ${
            isActive ? 'bg-semantic-legacy-brand-blush/60 text-semantic-text-primary font-semibold' : ''
          }`
        }
      >
        {link.label}
      </NavLink>
    ))}
  </nav>
)

export default AccountNav
