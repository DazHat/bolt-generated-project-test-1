import React, { useState, useCallback } from 'react';
import { LoginForm } from './components/LoginForm';
import { ContactList } from './components/ContactList';
import { ContactForm } from './components/ContactForm';
import { SearchBar } from './components/SearchBar';
import type { BusinessPartner } from './types/sap';
import { Users } from 'lucide-react';
import { SAPService } from './services/sapService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<BusinessPartner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<BusinessPartner>();
  const [sapService, setSapService] = useState<SAPService>();

  const loadContacts = useCallback(async () => {
    if (!sapService) return;
    
    setIsLoading(true);
    try {
      let filter = '';
      const conditions: string[] = [];
      
      if (searchTerm) {
        conditions.push(`contains(CardName,'${searchTerm}') or contains(EmailAddress,'${searchTerm}')`);
      }
      
      if (selectedType) {
        conditions.push(`CardType eq '${selectedType}'`);
      }
      
      if (conditions.length > 0) {
        filter = conditions.join(' and ');
      }
      
      const partners = await sapService.getBusinessPartners(filter);
      setContacts(partners);
    } catch (err) {
      setError('Failed to load contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sapService, searchTerm, selectedType]);

  const handleLogin = async (username: string, password: string, serviceUrl: string, companyDB: string) => {
    setError(undefined);
    setIsLoading(true);
    
    try {
      const service = new SAPService(serviceUrl, companyDB);
      await service.login(username, password);
      setSapService(service);
      setIsAuthenticated(true);
      const partners = await service.getBusinessPartners();
      setContacts(partners);
    } catch (err) {
      setError('Failed to login. Please check your credentials and connection settings.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitContact = async (contact: Partial<BusinessPartner>) => {
    if (!sapService) return;
    
    setIsLoading(true);
    try {
      if (selectedContact) {
        await sapService.updateBusinessPartner(selectedContact.CardCode, contact);
      } else {
        await sapService.createBusinessPartner(contact);
      }
      await loadContacts();
    } catch (err) {
      setError(selectedContact ? 'Failed to update contact' : 'Failed to create contact');
      console.error('Contact operation error:', err);
    } finally {
      setIsLoading(false);
      setSelectedContact(undefined);
    }
  };

  const handleDeleteContact = async (contact: BusinessPartner) => {
    if (!sapService || !window.confirm('Are you sure you want to delete this contact?')) return;
    
    setIsLoading(true);
    try {
      await sapService.deleteBusinessPartner(contact.CardCode);
      await loadContacts();
    } catch (err) {
      setError('Failed to delete contact');
      console.error('Delete error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditContact = (contact: BusinessPartner) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              SAP B1 Contacts
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
          <div className="flex justify-center items-center">
            <LoginForm onLogin={handleLogin} error={error} />
          </div>
        ) : (
          <div className="space-y-6">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={(term) => {
                setSearchTerm(term);
                loadContacts();
              }}
              selectedType={selectedType}
              onTypeChange={(type) => {
                setSelectedType(type);
                loadContacts();
              }}
              onAddNew={() => {
                setSelectedContact(undefined);
                setIsFormOpen(true);
              }}
            />
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <ContactList
              contacts={contacts}
              isLoading={isLoading}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
            
            <ContactForm
              contact={selectedContact}
              isOpen={isFormOpen}
              onClose={() => {
                setIsFormOpen(false);
                setSelectedContact(undefined);
              }}
              onSubmit={handleSubmitContact}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
