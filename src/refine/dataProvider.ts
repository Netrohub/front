import { DataProvider } from '@refinedev/core';

// Mock delay to simulate network
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for admin panel
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@nxoland.com',
    role: 'customer',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@nxoland.com',
    role: 'seller',
    status: 'active',
    created_at: '2024-02-20T14:15:00Z',
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike@nxoland.com',
    role: 'seller',
    status: 'pending',
    created_at: '2024-03-10T09:45:00Z',
  },
];

const mockOrders = [
  {
    id: 1,
    buyer: 'John Doe',
    seller: 'Sarah Johnson',
    amount: 150.00,
    escrow_status: 'pending',
    dispute_flag: false,
    created_at: '2024-01-20T11:30:00Z',
  },
  {
    id: 2,
    buyer: 'Mike Wilson',
    seller: 'Sarah Johnson',
    amount: 75.50,
    escrow_status: 'held',
    dispute_flag: true,
    created_at: '2024-02-15T16:20:00Z',
  },
];

const mockDisputes = [
  {
    id: 1,
    order_id: 2,
    type: 'quality_issue',
    state: 'open',
    created_at: '2024-02-16T10:00:00Z',
  },
  {
    id: 2,
    order_id: 1,
    type: 'delivery_issue',
    state: 'in_review',
    created_at: '2024-01-25T14:30:00Z',
  },
];

// Additional mock data for new resources
const mockVendors = [
  {
    id: 1,
    user_id: 2,
    display_name: 'Sarah Johnson',
    email: 'sarah@nxoland.com',
    kyc_status: 'verified',
    business_type: 'Individual',
    created_at: '2024-02-20T14:15:00Z',
    notes: 'Premium seller with excellent ratings',
  },
  {
    id: 2,
    user_id: 3,
    display_name: 'Mike Wilson',
    email: 'mike@nxoland.com',
    kyc_status: 'pending',
    business_type: 'Business',
    created_at: '2024-03-10T09:45:00Z',
    notes: 'New vendor awaiting verification',
  },
];

const mockListings = [
  {
    id: 1,
    title: 'Premium Instagram Account',
    slug: 'premium-instagram-account',
    seller: 'Sarah Johnson',
    price: 150.00,
    stock: 1,
    status: 'active',
    category: 'Social Media',
    rating: 4.8,
    sales_count: 23,
    created_at: '2024-02-20T14:15:00Z',
  },
  {
    id: 2,
    title: 'Gaming Account - Level 100',
    slug: 'gaming-account-level-100',
    seller: 'Mike Wilson',
    price: 75.50,
    stock: 3,
    status: 'pending',
    category: 'Gaming',
    rating: 4.5,
    sales_count: 12,
    created_at: '2024-03-10T09:45:00Z',
  },
];

const mockPayouts = [
  {
    id: 1,
    seller: 'Sarah Johnson',
    amount: 1250.00,
    method: 'Bank Transfer',
    status: 'paid',
    transaction_id: 'TXN-001234',
    processed_at: '2024-02-20T14:15:00Z',
    created_at: '2024-02-18T10:30:00Z',
  },
  {
    id: 2,
    seller: 'Mike Wilson',
    amount: 450.75,
    method: 'PayPal',
    status: 'pending',
    transaction_id: null,
    processed_at: null,
    created_at: '2024-03-10T09:45:00Z',
  },
];

const mockCategories = [
  {
    id: 1,
    name: 'Gaming',
    slug: 'gaming',
    description: 'Gaming accounts and digital items',
    product_count: 45,
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Social Media',
    slug: 'social-media',
    description: 'Social media accounts and services',
    product_count: 32,
    status: 'active',
    created_at: '2024-01-20T14:15:00Z',
  },
];

const mockCoupons = [
  {
    id: 1,
    code: 'WELCOME10',
    description: 'Welcome discount for new users',
    type: 'percentage',
    value: 10,
    min_amount: 50,
    max_discount: 25,
    usage_limit: 100,
    used_count: 23,
    status: 'active',
    expires_at: '2024-12-31T23:59:59Z',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    code: 'SAVE20',
    description: 'Flat discount for orders over $100',
    type: 'fixed',
    value: 20,
    min_amount: 100,
    max_discount: null,
    usage_limit: 50,
    used_count: 12,
    status: 'active',
    expires_at: '2024-06-30T23:59:59Z',
    created_at: '2024-02-01T14:15:00Z',
  },
];

const mockTickets = [
  {
    id: 1,
    subject: 'Account verification issue',
    user: 'john@example.com',
    priority: 'high',
    status: 'open',
    category: 'Account',
    assigned_to: 'Admin User',
    created_at: '2024-02-20T14:15:00Z',
    updated_at: '2024-02-20T16:30:00Z',
  },
  {
    id: 2,
    subject: 'Payment not received',
    user: 'sarah@example.com',
    priority: 'medium',
    status: 'in_progress',
    category: 'Payment',
    assigned_to: 'Support Team',
    created_at: '2024-02-18T10:30:00Z',
    updated_at: '2024-02-19T09:15:00Z',
  },
];

const mockAuditLogs = [
  {
    id: 1,
    user: 'admin@nxoland.com',
    action: 'User created',
    resource: 'users',
    resource_id: 123,
    details: 'Created new user account for john@example.com',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    level: 'info',
    created_at: '2024-02-20T14:15:00Z',
  },
  {
    id: 2,
    user: 'admin@nxoland.com',
    action: 'Order updated',
    resource: 'orders',
    resource_id: 456,
    details: 'Updated order status from pending to shipped',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    level: 'info',
    created_at: '2024-02-20T13:30:00Z',
  },
];

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    await delay();
    
    let data: any[] = [];
    
    switch (resource) {
      case 'users':
        data = mockUsers;
        break;
      case 'orders':
        data = mockOrders;
        break;
      case 'disputes':
        data = mockDisputes;
        break;
      case 'vendors':
        data = mockVendors;
        break;
      case 'listings':
        data = mockListings;
        break;
      case 'payouts':
        data = mockPayouts;
        break;
      case 'categories':
        data = mockCategories;
        break;
      case 'coupons':
        data = mockCoupons;
        break;
      case 'tickets':
        data = mockTickets;
        break;
      case 'audit-logs':
        data = mockAuditLogs;
        break;
      default:
        data = [];
    }

    // Apply pagination
    const page = pagination?.current || 1;
    const pageSize = pagination?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: data.length,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    await delay();
    
    let data: any = null;
    
    switch (resource) {
      case 'users':
        data = mockUsers.find(user => user.id === parseInt(id));
        break;
      case 'orders':
        data = mockOrders.find(order => order.id === parseInt(id));
        break;
      case 'disputes':
        data = mockDisputes.find(dispute => dispute.id === parseInt(id));
        break;
      case 'vendors':
        data = mockVendors.find(vendor => vendor.id === parseInt(id));
        break;
      case 'listings':
        data = mockListings.find(listing => listing.id === parseInt(id));
        break;
      case 'payouts':
        data = mockPayouts.find(payout => payout.id === parseInt(id));
        break;
      case 'categories':
        data = mockCategories.find(category => category.id === parseInt(id));
        break;
      case 'coupons':
        data = mockCoupons.find(coupon => coupon.id === parseInt(id));
        break;
      case 'tickets':
        data = mockTickets.find(ticket => ticket.id === parseInt(id));
        break;
      case 'audit-logs':
        data = mockAuditLogs.find(log => log.id === parseInt(id));
        break;
    }

    return { data };
  },

  create: async ({ resource, variables, meta }) => {
    await delay();
    console.log('🎭 Mock Admin API: Create', { resource, variables });
    return { data: { id: Date.now(), ...variables } };
  },

  update: async ({ resource, id, variables, meta }) => {
    await delay();
    console.log('🎭 Mock Admin API: Update', { resource, id, variables });
    return { data: { id: parseInt(id), ...variables } };
  },

  deleteOne: async ({ resource, id, meta }) => {
    await delay();
    console.log('🎭 Mock Admin API: Delete', { resource, id });
    return { data: { id: parseInt(id) } };
  },

  getApiUrl: () => {
    return 'http://localhost:8083';
  },

  custom: async ({ url, method, filters, sorters, payload, query, headers, meta }) => {
    await delay();
    console.log('🎭 Mock Admin API: Custom', { url, method, payload });
    return { data: { success: true } };
  },
};
