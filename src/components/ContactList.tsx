import React from 'react';
import { Phone, Mail, MapPin, Edit2, Trash2 } from 'lucide-react';
import type { BusinessPartner } from '../types/sap';

interface ContactListProps {
  contacts: BusinessPartner[];
  isLoading: boolean;
  onEdit: (contact: BusinessPartner) => void;
  onDelete: (contact: BusinessPartner) => void;
}

export function ContactList({ contacts, isLoading, onEdit, onDelete }: ContactListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No contacts found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <div key={contact.CardCode} className="bg-white rounded-lg shadow-md p-6 relative group">
          <div className="absolute top-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(contact)}
              className="text-gray-500 hover:text-blue-600 p-1"
              title="Edit contact"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(contact)}
              className="text-gray-500 hover:text-red-600 p-1"
              title="Delete contact"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-semibold mb-2">{contact.CardName}</h3>
          <p className="text-sm text-gray-500 mb-4">
            ID: {contact.CardCode}
            <span className="mx-2">•</span>
            {contact.CardType === 'cCustomer' ? 'Customer' :
             contact.CardType === 'cSupplier' ? 'Supplier' : 'Lead'}
          </p>
          
          {contact.Phone1 && (
            <div className="flex items-center mb-2">
              <Phone className="w-4 h-4 mr-2 text-gray-600" />
              <span>{contact.Phone1}</span>
            </div>
          )}
          
          {contact.EmailAddress && (
            <div className="flex items-center mb-2">
              <Mail className="w-4 h-4 mr-2 text-gray-600" />
              <a href={`mailto:${contact.EmailAddress}`} className="text-blue-600 hover:underline">
                {contact.EmailAddress}
              </a>
            </div>
          )}
          
          {contact.Address && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-600" />
              <span>{contact.Address}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
