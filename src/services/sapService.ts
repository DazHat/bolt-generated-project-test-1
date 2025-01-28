import type { BusinessPartner, SAPResponse } from '../types/sap';

export class SAPService {
  private baseUrl: string;
  private companyDB: string;
  private session: string | null = null;

  constructor(serviceUrl: string, companyDB: string) {
    this.baseUrl = serviceUrl;
    this.companyDB = companyDB;
  }

  async login(username: string, password: string) {
    try {
      const response = await fetch(`${this.baseUrl}/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CompanyDB: this.companyDB,
          UserName: username,
          Password: password,
        }),
        credentials: 'include', // Important for cookie handling
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Login failed');
      }

      // SAP B1 Service Layer sets cookies in the response
      // The browser will automatically handle the cookie for subsequent requests
      const cookies = response.headers.get('Set-Cookie');
      if (!cookies) {
        throw new Error('No session cookie received');
      }

      this.session = cookies;
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Login failed');
    }
  }

  async getBusinessPartners(filter?: string): Promise<BusinessPartner[]> {
    if (!this.session) {
      throw new Error('Not authenticated');
    }

    try {
      const url = new URL(`${this.baseUrl}/BusinessPartners`);
      if (filter) {
        url.searchParams.append('$filter', filter);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Cookie': this.session,
        },
        credentials: 'include', // Important for cookie handling
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to fetch business partners');
      }

      const data: SAPResponse<BusinessPartner> = await response.json();
      return data.value;
    } catch (error) {
      console.error('Error fetching business partners:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch business partners');
    }
  }

  async createBusinessPartner(partner: Partial<BusinessPartner>): Promise<BusinessPartner> {
    if (!this.session) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/BusinessPartners`, {
        method: 'POST',
        headers: {
          'Cookie': this.session,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookie handling
        body: JSON.stringify(partner),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to create business partner');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating business partner:', error);
      throw error instanceof Error ? error : new Error('Failed to create business partner');
    }
  }

  async updateBusinessPartner(cardCode: string, partner: Partial<BusinessPartner>): Promise<BusinessPartner> {
    if (!this.session) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/BusinessPartners('${cardCode}')`, {
        method: 'PATCH',
        headers: {
          'Cookie': this.session,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookie handling
        body: JSON.stringify(partner),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to update business partner');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating business partner:', error);
      throw error instanceof Error ? error : new Error('Failed to update business partner');
    }
  }

  async deleteBusinessPartner(cardCode: string): Promise<void> {
    if (!this.session) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/BusinessPartners('${cardCode}')`, {
        method: 'DELETE',
        headers: {
          'Cookie': this.session,
        },
        credentials: 'include', // Important for cookie handling
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to delete business partner');
      }
    } catch (error) {
      console.error('Error deleting business partner:', error);
      throw error instanceof Error ? error : new Error('Failed to delete business partner');
    }
  }
}
