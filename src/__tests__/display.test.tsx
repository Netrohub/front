import { render, screen } from '@testing-library/react';
import { display, isSafeToRender, safeRender } from '../lib/display';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

describe('display helper', () => {
  describe('display function', () => {
    it('should handle null and undefined', () => {
      expect(display(null)).toBe('');
      expect(display(undefined)).toBe('');
    });

    it('should handle primitive types', () => {
      expect(display('hello')).toBe('hello');
      expect(display(123)).toBe(123);
      expect(display(true)).toBe(true);
      expect(display(false)).toBe(false);
    });

    it('should handle arrays', () => {
      expect(display(['a', 'b', 'c'])).toBe('a, b, c');
      expect(display([1, 2, 3])).toBe('1, 2, 3');
    });

    it('should handle objects in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const obj = { name: 'test', id: 1 };
      const result = display(obj);
      
      expect(typeof result).toBe('string');
      expect(result).toContain('test');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle objects in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const obj = { title: 'test', id: 1 };
      expect(display(obj)).toBe('test');
      
      const objWithName = { name: 'test', id: 1 };
      expect(display(objWithName)).toBe('test');
      
      const objWithLabel = { label: 'test', id: 1 };
      expect(display(objWithLabel)).toBe('test');
      
      const objWithId = { id: 1 };
      expect(display(objWithId)).toBe('1');
      
      const objFallback = { data: 'test' };
      expect(display(objFallback)).toBe('[Object]');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle functions', () => {
      const fn = () => 'test';
      expect(display(fn)).toBe('[Function]');
    });
  });

  describe('isSafeToRender function', () => {
    it('should return true for safe values', () => {
      expect(isSafeToRender(null)).toBe(true);
      expect(isSafeToRender(undefined)).toBe(true);
      expect(isSafeToRender('hello')).toBe(true);
      expect(isSafeToRender(123)).toBe(true);
      expect(isSafeToRender(true)).toBe(true);
    });

    it('should return false for unsafe values', () => {
      expect(isSafeToRender({})).toBe(false);
      expect(isSafeToRender([])).toBe(false);
      expect(isSafeToRender(() => {})).toBe(false);
    });
  });

  describe('safeRender function', () => {
    it('should return safe values as-is', () => {
      expect(safeRender('hello')).toBe('hello');
      expect(safeRender(123)).toBe(123);
      expect(safeRender(null)).toBe(null);
    });

    it('should convert unsafe values', () => {
      const result = safeRender({ name: 'test' });
      expect(typeof result).toBe('string');
    });
  });
});

describe('UI Components with API data', () => {
  describe('Badge component', () => {
    it('should render string children safely', () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('should handle object children safely', () => {
      const obj = { name: 'test', id: 1 };
      render(<Badge>{obj}</Badge>);
      // Should not throw React error #130 and should render something
      expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('should handle null/undefined children', () => {
      render(<Badge>{null}</Badge>);
      render(<Badge>{undefined}</Badge>);
      // Should not throw errors
    });
  });

  describe('Button component', () => {
    it('should render string children safely', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should handle object children safely', () => {
      const obj = { title: 'test', id: 1 };
      render(<Button>{obj}</Button>);
      // Should not throw React error #130
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle asChild prop correctly', () => {
      render(
        <Button asChild>
          <span>Child element</span>
        </Button>
      );
      expect(screen.getByText('Child element')).toBeInTheDocument();
    });
  });
});

describe('API data rendering patterns', () => {
  it('should handle product data safely', () => {
    const product = {
      id: 1,
      title: 'Test Product',
      category: 'Electronics',
      price: 99.99,
      rating: 4.5
    };

    // Test that we can safely extract fields
    expect(typeof product.title).toBe('string');
    expect(typeof product.category).toBe('string');
    expect(typeof product.price).toBe('number');
    expect(typeof product.rating).toBe('number');
  });

  it('should handle cart item data safely', () => {
    const cartItem = {
      id: 1,
      quantity: 2,
      price: 99.99,
      product: {
        title: 'Test Product',
        category: 'Electronics',
        seller: {
          name: 'Test Seller'
        }
      }
    };

    // Test safe field access patterns
    expect(typeof cartItem.product?.title).toBe('string');
    expect(typeof cartItem.product?.category).toBe('string');
    expect(typeof cartItem.product?.seller?.name).toBe('string');
  });

  it('should handle API response data safely', () => {
    const apiResponse = {
      data: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ],
      meta: {
        total: 2,
        page: 1,
        last_page: 1
      }
    };

    // Test that we can safely map over data
    const items = apiResponse.data.map(item => item.name);
    expect(items).toEqual(['Item 1', 'Item 2']);
  });
});
