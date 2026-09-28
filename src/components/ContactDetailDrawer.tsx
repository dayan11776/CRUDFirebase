import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  HeartHandshake,
  MapPin,
  Edit2,
  Trash2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Contact } from '../types/contact';

interface ContactDetailDrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onCopyText: (text: string, label: string) => void;
  copiedText: string | null;
}

export const ContactDetailDrawer: React.FC<ContactDetailDrawerProps> = ({
  contact,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onCopyText,
  copiedText,
}) => {
  if (!isOpen || !contact) return null;

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden bg-neutral-950/20 backdrop-blur-2xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-white shadow-2xl border-l border-neutral-200 flex flex-col animate-in slide-in-from-right duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top header */}
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900">Contact Details</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Identity block */}
            <div className="flex items-center gap-3 pb-6 border-b border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-700 select-none">
                {contact.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold text-neutral-900 truncate">{contact.name}</h2>
                <p className="text-xs text-neutral-500 font-mono truncate">{contact.email}</p>
              </div>
            </div>

            {/* Strict 4 Fields View */}
            <div className="space-y-4">
              {/* Field 1: Name */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200/70 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Name</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopyText(contact.name, 'Name')}
                    className="text-neutral-400 hover:text-neutral-700 text-xs flex items-center gap-1"
                  >
                    {copiedText === contact.name ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-sm font-medium text-neutral-900 mt-1">{contact.name}</p>
              </div>

              {/* Field 2: Email */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200/70 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onCopyText(contact.email, 'Email')}
                      className="text-neutral-400 hover:text-neutral-700 text-xs flex items-center gap-1"
                    >
                      {copiedText === contact.email ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy</span>
                    </button>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-neutral-700 hover:text-neutral-950 text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Send Mail</span>
                    </a>
                  </div>
                </div>
                <p className="text-sm font-medium text-neutral-900 font-mono text-xs mt-1 truncate">
                  {contact.email}
                </p>
              </div>

              {/* Field 3: Contact Number */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200/70 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Contact Number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onCopyText(contact.contactNumber, 'Contact Number')}
                      className="text-neutral-400 hover:text-neutral-700 text-xs flex items-center gap-1"
                    >
                      {copiedText === contact.contactNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy</span>
                    </button>
                    <a
                      href={`tel:${contact.contactNumber}`}
                      className="text-neutral-700 hover:text-neutral-950 text-xs flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
                <p className="text-sm font-medium text-neutral-900 font-mono tabular-nums mt-1">
                  {contact.contactNumber}
                </p>
              </div>

              {/* Field 4: Gender */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200/70 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                    <HeartHandshake className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Gender</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopyText(contact.gender, 'Gender')}
                    className="text-neutral-400 hover:text-neutral-700 text-xs flex items-center gap-1"
                  >
                    {copiedText === contact.gender ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-sm font-medium text-neutral-900 mt-1">{contact.gender}</p>
              </div>

              {/* Optional Field: Address */}
              {contact.address && (
                <div className="p-3.5 bg-neutral-50 border border-neutral-200/70 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Address</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onCopyText(contact.address || '', 'Address')}
                      className="text-neutral-400 hover:text-neutral-700 text-xs flex items-center gap-1"
                    >
                      {copiedText === contact.address ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-sm font-medium text-neutral-900 mt-1">{contact.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(contact);
              }}
              className="px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(contact);
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
