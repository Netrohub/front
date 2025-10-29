/**
 * Utility functions to transform backend data structures to match frontend interfaces
 */

/**
 * Transform backend user structure to frontend User interface
 */
export function transformUser(backendUser: any): any {
  if (!backendUser) return null;

  // Extract role from user_roles array
  let role = 'user';
  if (backendUser.user_roles && Array.isArray(backendUser.user_roles) && backendUser.user_roles.length > 0) {
    role = backendUser.user_roles[0]?.role?.slug || 'user';
  }

  // Map is_active boolean to status string
  let status: 'active' | 'inactive' | 'suspended' = 'active';
  if (!backendUser.is_active) {
    status = 'inactive';
  } else if (backendUser.is_banned) {
    status = 'suspended';
  }

  return {
    ...backendUser,
    role,
    status,
    // Keep original fields for compatibility
    user_roles: backendUser.user_roles,
    is_active: backendUser.is_active,
  };
}

/**
 * Transform backend product/listing structure
 */
export function transformProduct(backendProduct: any): any {
  if (!backendProduct) return null;

  return {
    ...backendProduct,
    // Map 'name' to 'title' if needed
    title: backendProduct.title || backendProduct.name,
    // Map ProductStatus enum to lowercase string
    status: backendProduct.status?.toLowerCase() || 'pending',
  };
}

/**
 * Transform backend order structure
 */
export function transformOrder(backendOrder: any): any {
  if (!backendOrder) return null;

  return {
    ...backendOrder,
    // Map payment_status to escrow_status
    escrow_status: backendOrder.payment_status?.toLowerCase() || 'pending',
    // Map dispute_flag if exists
    dispute_flag: backendOrder.disputes && backendOrder.disputes.length > 0,
  };
}

/**
 * Transform backend dispute structure
 */
export function transformDispute(backendDispute: any): any {
  if (!backendDispute) return null;

  return {
    ...backendDispute,
    // Map DisputeStatus enum to lowercase string
    state: backendDispute.status?.toLowerCase() || 'open',
    // Keep original status for compatibility
    status: backendDispute.status,
  };
}

/**
 * Transform multiple items of a specific type
 */
export function transformItems<T>(items: any[], transformFn: (item: any) => T): T[] {
  if (!Array.isArray(items)) return [];
  return items.map(transformFn).filter(Boolean);
}

/**
 * Transform users list
 */
export function transformUsers(users: any[]): any[] {
  return transformItems(users, transformUser);
}

/**
 * Transform products/listings list
 */
export function transformProducts(products: any[]): any[] {
  return transformItems(products, transformProduct);
}

/**
 * Transform orders list
 */
export function transformOrders(orders: any[]): any[] {
  return transformItems(orders, transformOrder);
}

/**
 * Transform disputes list
 */
export function transformDisputes(disputes: any[]): any[] {
  return transformItems(disputes, transformDispute);
}

