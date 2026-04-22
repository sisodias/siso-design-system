export interface MailingAddress {
  id: string
  address1: string
  address2?: string
  city: string
  company?: string
  country: string
  firstName: string
  lastName: string
  phone?: string
  province?: string
  zip: string
}

interface MailingAddressInput {
  address1?: string
  address2?: string
  city?: string
  company?: string
  country?: string
  firstName?: string
  lastName?: string
  phone?: string
  province?: string
  zip?: string
}

interface ShopifyCustomerResponse {
  customer?: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    defaultAddress?: MailingAddress
    addresses: {
      nodes: MailingAddress[]
    }
  }
  error?: { message: string }
}

interface AddressMutationResponse {
  customerAddress?: MailingAddress
  customerUserErrors?: Array<{ field?: string[]; message: string }>
  error?: string
}

export async function fetchShopifyAddresses(
  customerAccessToken?: string
): Promise<ShopifyCustomerResponse> {
  const query = `
    query customerAddresses($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        defaultAddress {
          id
          address1
          address2
          city
          company
          country
          firstName
          lastName
          phone
          province
          zip
        }
        addresses(first: 20) {
          nodes {
            id
            address1
            address2
            city
            company
            country
            firstName
            lastName
            phone
            province
            zip
          }
        }
      }
    }
  `

  try {
    const response = await fetch(import.meta.env.VITE_SHOPIFY_STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { customerAccessToken: customerAccessToken || '' },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      return { error: { message: data.errors[0].message } }
    }

    const customer = data.data?.customer

    if (!customer) {
      return { error: { message: 'Customer not found. Please log in.' } }
    }

    return { customer }
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return {
      error: { message: error instanceof Error ? error.message : 'Failed to fetch addresses' },
    }
  }
}

export async function createShopifyAddress(
  address: MailingAddressInput,
  customerAccessToken?: string
): Promise<AddressMutationResponse> {
  const mutation = `
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress {
          id
          address1
          address2
          city
          company
          country
          firstName
          lastName
          phone
          province
          zip
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `

  try {
    const response = await fetch(import.meta.env.VITE_SHOPIFY_STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { customerAccessToken: customerAccessToken || '', address },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const result = data.data?.customerAddressCreate

    if (result?.customerUserErrors?.length > 0) {
      return { customerUserErrors: result.customerUserErrors }
    }

    if (data.errors) {
      return { error: data.errors[0].message }
    }

    return { customerAddress: result?.customerAddress }
  } catch (error) {
    console.error('Error creating address:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create address',
    }
  }
}

export async function updateShopifyAddress(
  id: string,
  address: MailingAddressInput,
  customerAccessToken?: string
): Promise<AddressMutationResponse> {
  const mutation = `
    mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
      customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
        customerAddress {
          id
          address1
          address2
          city
          company
          country
          firstName
          lastName
          phone
          province
          zip
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `

  try {
    const response = await fetch(import.meta.env.VITE_SHOPIFY_STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { customerAccessToken: customerAccessToken || '', id, address },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const result = data.data?.customerAddressUpdate

    if (result?.customerUserErrors?.length > 0) {
      return { customerUserErrors: result.customerUserErrors }
    }

    if (data.errors) {
      return { error: data.errors[0].message }
    }

    return { customerAddress: result?.customerAddress }
  } catch (error) {
    console.error('Error updating address:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update address',
    }
  }
}

export async function deleteShopifyAddress(
  id: string,
  customerAccessToken?: string
): Promise<{ success?: boolean; error?: string }> {
  const mutation = `
    mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        customerUserErrors {
          field
          message
        }
        deletedCustomerAddressId
      }
    }
  `

  try {
    const response = await fetch(import.meta.env.VITE_SHOPIFY_STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { customerAccessToken: customerAccessToken || '', id },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const result = data.data?.customerAddressDelete

    if (result?.customerUserErrors?.length > 0) {
      return { error: result.customerUserErrors[0].message }
    }

    if (data.errors) {
      return { error: data.errors[0].message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting address:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete address',
    }
  }
}

export async function setDefaultShopifyAddress(
  addressId: string,
  customerAccessToken?: string
): Promise<{ success?: boolean; error?: string }> {
  const mutation = `
    mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
      customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
        customer {
          id
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `

  try {
    const response = await fetch(import.meta.env.VITE_SHOPIFY_STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { customerAccessToken: customerAccessToken || '', addressId },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const result = data.data?.customerDefaultAddressUpdate

    if (result?.customerUserErrors?.length > 0) {
      return { error: result.customerUserErrors[0].message }
    }

    if (data.errors) {
      return { error: data.errors[0].message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error setting default address:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to set default address',
    }
  }
}

export function formatAddress(address: MailingAddress): string {
  const parts = [
    address.firstName && address.lastName ? `${address.firstName} ${address.lastName}` : null,
    address.company,
    address.address1,
    address.address2,
    `${address.city}${address.province ? `, ${address.province}` : ''} ${address.zip}`,
    address.country,
  ].filter(Boolean)

  return parts.join('\n')
}
