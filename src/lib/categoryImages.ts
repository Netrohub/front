// Mapping of product categories to their standard images/logos
// This ensures consistent branding across the marketplace

export const categoryImages: Record<string, string> = {
  // Social Media Platforms
  "instagram": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop",
  "tiktok": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop",
  "youtube": "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=400&fit=crop",
  "twitter": "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=400&fit=crop",
  "facebook": "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=400&fit=crop",
  "discord": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop",
  "snapchat": "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=400&h=400&fit=crop",
  "linkedin": "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=400&h=400&fit=crop",
  "pinterest": "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop",
  "reddit": "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=400&h=400&fit=crop",
  "twitch": "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop",
  
  // Gaming Platforms
  "steam": "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop",
  "playstation": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
  "xbox": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop",
  "nintendo": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
  "epic games": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop",
  "blizzard": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop",
  "origin": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop",
  
  // Popular Games
  "fortnite": "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=400&h=400&fit=crop",
  "minecraft": "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=400&h=400&fit=crop",
  "gta": "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=400&fit=crop",
  "cod": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop",
  "valorant": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop",
  "league of legends": "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=400&fit=crop",
  "dota": "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=400&fit=crop",
  "csgo": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop",
  "pubg": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop",
  "apex legends": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop",
  "overwatch": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop",
  "rocket league": "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=400&fit=crop",
  "roblox": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop",
  
  // Generic Categories
  "gaming": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop",
  "social": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop",
  "accounts": "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop",
  "digital": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
};

/**
 * Get the standard image for a product category
 * @param category - The product category (case-insensitive)
 * @param fallbackImage - Optional fallback image if category not found
 * @returns The image URL for the category
 */
export const getCategoryImage = (category: string, fallbackImage?: string): string => {
  const normalizedCategory = category.toLowerCase().trim();
  
  // Direct match
  if (categoryImages[normalizedCategory]) {
    return categoryImages[normalizedCategory];
  }
  
  // Partial match - check if category contains any key
  for (const [key, image] of Object.entries(categoryImages)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return image;
    }
  }
  
  // Return fallback or default gaming image
  return fallbackImage || categoryImages["gaming"];
};

/**
 * Get a display-friendly category name
 * @param category - The product category
 * @returns Formatted category name
 */
export const formatCategoryName = (category: string): string => {
  return category
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
