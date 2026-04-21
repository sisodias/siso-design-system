'use client'
import { useCart, CartItem } from './CartProvider'

interface Props { item: CartItem }
export default function CartToggleButton({ item }: Props) {
  const { has, add, remove } = useCart()
  const selected = has(item.source, item.name)
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (selected) remove(item.source, item.name); else add(item)
  }
  return (
    <button
      onClick={toggle}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        selected
          ? 'border-green-600 bg-green-900/50 text-green-200'
          : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
      }`}
    >
      {selected ? '✓ Selected' : '+ Select'}
    </button>
  )
}
