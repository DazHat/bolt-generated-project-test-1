export interface BusinessPartner {
  CardCode: string;
  CardName: string;
  CardType: 'cCustomer' | 'cSupplier' | 'cLid';
  EmailAddress?: string;
  Phone1?: string;
  Cellular?: string;
  Address?: string;
}

export interface SAPResponse<T> {
  value: T[];
  odata.nextLink?: string;
}
