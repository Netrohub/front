/**
 * Tap Payment Gateway Integration
 * https://www.tap.company/en-sa
 * Sandbox Mode for Testing
 */

export interface TapPaymentConfig {
  publicKey: string;
  merchantId: string;
  source: {
    id: string;
  };
  redirect: {
    url: string;
  };
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: {
      country_code: string;
      number: string;
    };
  };
  order: {
    amount: number;
    currency: string;
    items?: Array<{
      name: string;
      quantity: number;
      amount_per_unit: number;
    }>;
  };
  transaction: {
    mode: 'charge' | 'authorize' | 'token';
    charge_mode: 'card' | 'knet' | 'benefit' | 'fawry' | 'qpay';
  };
}

export interface TapPaymentResponse {
  id: string;
  status: 'INITIATED' | 'AUTHORIZED' | 'CAPTURED' | 'VOID' | 'DECLINED';
  amount: number;
  currency: string;
  customer: any;
  transaction: {
    authorization_id: string;
  };
}

class TapPaymentService {
  private publicKey: string;
  private isSandbox: boolean;

  constructor() {
    // Sandbox credentials
    this.publicKey = import.meta.env.VITE_TAP_PUBLIC_KEY || 'pk_test_sandbox_key';
    this.isSandbox = import.meta.env.VITE_TAP_SANDBOX === 'true' || true;
  }

  /**
   * Initialize Tap Payment SDK
   */
  async initializeTap(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is not defined'));
        return;
      }

      // Check if script already loaded
      if ((window as any).Tap) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = this.isSandbox 
        ? 'https://tap-sdks.b-cdn.net/card-sdk/v2/tap-card.js'
        : 'https://tap-sdks.b-cdn.net/card-sdk/v2/tap-card.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Tap Payment SDK'));
      document.body.appendChild(script);
    });
  }

  /**
   * Create a payment charge
   */
  async createCharge(config: Partial<TapPaymentConfig>): Promise<TapPaymentResponse> {
    try {
      console.log('🔒 TAP: Creating payment charge', { amount: config.order?.amount, sandbox: this.isSandbox });

      // In sandbox mode, simulate successful payment
      if (this.isSandbox) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
          id: `ch_sandbox_${Date.now()}`,
          status: 'CAPTURED',
          amount: config.order?.amount || 0,
          currency: config.order?.currency || 'USD',
          customer: config.customer,
          transaction: {
            authorization_id: `auth_sandbox_${Date.now()}`,
          },
        };
      }

      // Production mode - integrate with real API
      const response = await fetch('https://api.tap.company/v2/charges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.publicKey}`,
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Payment charge failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ TAP: Payment failed', error);
      throw error;
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(chargeId: string): Promise<TapPaymentResponse> {
    try {
      console.log('🔍 TAP: Verifying payment', chargeId);

      // In sandbox mode, return success
      if (this.isSandbox) {
        return {
          id: chargeId,
          status: 'CAPTURED',
          amount: 0,
          currency: 'USD',
          customer: {},
          transaction: {
            authorization_id: 'auth_sandbox',
          },
        };
      }

      // Production mode
      const response = await fetch(`https://api.tap.company/v2/charges/${chargeId}`, {
        headers: {
          'Authorization': `Bearer ${this.publicKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ TAP: Verification failed', error);
      throw error;
    }
  }

  /**
   * Process card payment (sandbox mode)
   */
  async processCardPayment(
    cardDetails: {
      number: string;
      name: string;
      expiry: string;
      cvv: string;
    },
    amount: number,
    currency: string = 'USD'
  ): Promise<TapPaymentResponse> {
    try {
      console.log('💳 TAP: Processing card payment', { amount, currency, sandbox: this.isSandbox });

      // Validate card details format
      const expiryParts = cardDetails.expiry.split('/');
      if (expiryParts.length !== 2) {
        throw new Error('Invalid expiry date format. Use MM/YY');
      }

      const [month, year] = expiryParts.map(p => p.trim());
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        throw new Error('Invalid expiry date format. Use MM/YY');
      }

      // In sandbox mode, validate test cards
      if (this.isSandbox) {
        const testCards = [
          '4111111111111111', // Visa success
          '5200000000000007', // Mastercard success
        ];

        const cardNumber = cardDetails.number.replace(/\s/g, '');
        
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (testCards.includes(cardNumber)) {
          return {
            id: `ch_sandbox_${Date.now()}`,
            status: 'CAPTURED',
            amount,
            currency,
            customer: { name: cardDetails.name },
            transaction: {
              authorization_id: `auth_sandbox_${Date.now()}`,
            },
          };
        } else {
          throw new Error('Card declined. Use test card: 4111 1111 1111 1111');
        }
      }

      // Production mode would integrate with real Tap API
      throw new Error('Production mode not implemented. Use sandbox mode.');
    } catch (error) {
      console.error('❌ TAP: Card payment failed', error);
      throw error;
    }
  }

  /**
   * Get test cards for sandbox
   */
  getTestCards() {
    return [
      {
        number: '4111 1111 1111 1111',
        type: 'Visa',
        result: 'Success',
        cvv: '123',
        expiry: '12/25',
      },
      {
        number: '5200 0000 0000 0007',
        type: 'Mastercard',
        result: 'Success',
        cvv: '123',
        expiry: '12/25',
      },
    ];
  }

  isSandboxMode(): boolean {
    return this.isSandbox;
  }
}

export const tapPayment = new TapPaymentService();

