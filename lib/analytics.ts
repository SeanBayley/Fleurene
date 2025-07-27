import { track } from '@vercel/analytics'

// Custom analytics tracking functions
export const analytics = {
  // Track product views
  trackProductView: (productName: string, productId: string, price: number) => {
    track('product_view', {
      product_name: productName,
      product_id: productId,
      price: price,
      currency: 'ZAR'
    })
  },

  // Track add to cart
  trackAddToCart: (productName: string, productId: string, price: number, quantity: number) => {
    track('add_to_cart', {
      product_name: productName,
      product_id: productId,
      price: price,
      quantity: quantity,
      currency: 'ZAR'
    })
  },

  // Track purchase
  trackPurchase: (orderNumber: string, total: number, itemCount: number) => {
    track('purchase', {
      order_number: orderNumber,
      total: total,
      currency: 'ZAR',
      item_count: itemCount
    })
  },

  // Track checkout start
  trackCheckoutStart: (total: number, itemCount: number) => {
    track('begin_checkout', {
      total: total,
      item_count: itemCount,
      currency: 'ZAR'
    })
  },

  // Track page views
  trackPageView: (page: string) => {
    track('page_view', {
      page: page
    })
  },

  // Track user sign up
  trackSignUp: (method: string) => {
    track('sign_up', {
      method: method
    })
  },

  // Track user login
  trackLogin: (method: string) => {
    track('login', {
      method: method
    })
  },

  // Track search
  trackSearch: (query: string, results: number) => {
    track('search', {
      query: query,
      results: results
    })
  },

  // Track admin actions
  trackAdminAction: (action: string, details?: any) => {
    track('admin_action', {
      action: action,
      details: details
    })
  }
} 