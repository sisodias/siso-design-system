export { OrderCard } from './components/OrderCard'
export type { Order } from './components/OrderCard'
export { fetchShopifyOrders } from './hooks/useShopifyOrders'

export type { MailingAddress } from './hooks/useShopifyAddresses'
export {
  fetchShopifyAddresses,
  createShopifyAddress,
  updateShopifyAddress,
  deleteShopifyAddress,
  setDefaultShopifyAddress,
  formatAddress,
} from './hooks/useShopifyAddresses'
