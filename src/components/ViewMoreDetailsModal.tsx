import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  HeartHandshake,
  MapPin,
  Calendar,
  Activity,
  Copy,
  Check,
  ExternalLink,
  Edit2,
} from 'lucide-react';
import { Contact } from '../types/contact';

interface ViewMoreDetailsModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onCopyText: (text: string, label: string) => void;
  copiedText: string | null;
}

export const ViewMoreDetailsModal: React.FC<ViewMoreDetailsModalProps> = ({
  contact,
  isOpen,
  onClose,
  onEdit,
  onCopyText,
  copiedText,
}) => {
  if (!isOpen || !contact) return null;

  const initials = contact.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');

  const statusColors = {
    Active: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60',
    Inactive: 'bg-slate-900 text-slate-400 border-slate-700',
    Pending: 'bg-amber-950/60 text-amber-300 border-amber-700/60',
  };

  const currentStatus = contact.status || 'Active';
  const badgeStyle =
    statusColors[currentStatus as keyof typeof statusColors] ||
    'bg-[#050c1e] text-slate-300 border-[#162c54]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020612]/80 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="person-detail-modal-title"
    >
      <div className="w-full max-w-lg bg-[#0c1836] border border-[#1f3e6d] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#162c54] bg-[#08132b]">
          <div className="flex items-center gap-2">
            <h2 id="person-detail-modal-title" className="text-base font-bold text-[#fdf0d5]">
              Person Details
            </h2>
            <span
              className={`px-2 py-0.5 text-[11px] font-bold rounded-full border ${badgeStyle}`}
            >
              {currentStatus}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-[#fdf0d5] p-1.5 rounded-lg hover:bg-[#13274e] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Profile Summary */}
          <div className="flex items-center gap-4 pb-5 border-b border-[#162c54]">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#162c54] ring-2 ring-[#1f3e6d] shadow-sm bg-[#050c1e] flex items-center justify-center shrink-0 select-none">
              {contact.avatarUrl ? (
                <img
                  src={contact.avatarUrl}
                  alt={contact.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#050c1e] to-[#1f3e6d] flex items-center justify-center font-bold text-[#fdf0d5] text-xl">
                  {initials || <User className="w-8 h-8 text-[#fdf0d5]" />}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-[#fdf0d5] leading-tight truncate">
                {contact.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-2">
                <span>
                  Age:{' '}
                  <strong className="text-slate-200 font-bold tabular-nums">
                    {contact.age ?? 35}
                  </strong>{' '}
                  years old
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[#fdf0d5] font-semibold">{contact.gender}</span>
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#fdf0d5]/70 shrink-0" />
                <span>{contact.address || 'New York, USA'}</span>
              </p>
            </div>
          </div>

          {/* Detailed Fields Grid: Name, Age, Email, Address, Contact Number, Gender, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Name */}
            <div className="p-3 bg-[#050c1e] border border-[#162c54] rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#fdf0d5]" />
                  Full Name
                </span>
                <button
                  type="button"
                  onClick={() => onCopyText(contact.name, 'Name')}
                  className="text-slate-400 hover:text-[#fdf0d5] text-[11px] flex items-center gap-0.5 cursor-pointer"
                >
                  {copiedText === contact.name ? (
                    <Check className="w-3 h-3 text-[#fdf0d5]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-100 truncate">{contact.name}</p>
            </div>

            {/* 2. Age */}
            <div className="p-3 bg-[#050c1e] border border-[#162c54] rounded-xl">
              <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#fdf0d5]" />
                Age
              </div>
              <p className="text-sm font-semibold text-slate-100 tabular-nums">
                {contact.age ?? 35} years old
              </p>
            </div>

            {/* 3. Email */}
            <div className="p-3 bg-[#050c1e] border border-[#162c54] rounded-xl sm:col-span-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#fdf0d5]" />
                  Email Address
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onCopyText(contact.email, 'Email')}
                    className="text-slate-400 hover:text-[#fdf0d5] text-[11px] flex items-center gap-0.5 cursor-pointer"
                  >
                    {copiedText === contact.email ? (
                      <Check className="w-3 h-3 text-[#fdf0d5]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copy</span>
                  </button>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[#fdf0d5] hover:underline text-[11px] flex items-center gap-0.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Send Mail</span>
                  </a>
                </div>
              </div>
              <p className="text-sm font-semibold text-[#fdf0d5] font-mono text-xs truncate">
                {contact.email}
              </p>
            </div>

            {/* 4. Contact Number */}
            <div className="p-3 bg-[#050c1e] border border-[#162c54] rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#fdf0d5]" />
                  Contact Number
                </span>
                <button
                  type="button"
                  onClick={() => onCopyText(contact.contactNumber, 'Contact Number')}
                  className="text-slate-400 hover:text-[#fdf0d5] text-[11px] flex items-center gap-0.5 cursor-pointer"
                >
                  {copiedText === contact.contactNumber ? (
                    <Check className="w-3 h-3 text-[#fdf0d5]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-100 font-mono tabular-nums">
                {contact.contactNumber}
              </p>
            </div>

            {/* 5. Gender */}
            <div className="p-3 bg-[#050c1e] border border-[#162c54] rounded-xl">
              <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#fdf0d5]" />
                Gender
              </div>
              <p className="text-sm font-semibold text-[#fdf0d5]">{contact.gender}</p>
            </div>

            {/* 6. Address */}
            <div className="p-3 bg-[#050c1e] border border-[#162c54] rounded-xl sm:col-span-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#fdf0d5]" />
                  Address
                </span>
                <button
                  type="button"
                  onClick={() => onCopyText(contact.address, 'Address')}
                  className="text-slate-400 hover:text-[#fdf0d5] text-[11px] flex items-center gap-0.5 cursor-pointer"
                >
                  {copiedText === contact.address ? (
                    <Check className="w-3 h-3 text-[#fdf0d5]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-100">{contact.address}</p>
            </div>

            {/* 7. Status */}
            <div className="p-3 bg-[#050c1e] border border-[#162c54] rounded-xl sm:col-span-2">
              <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#fdf0d5]" />
                Account Status
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${badgeStyle}`}>
                  {currentStatus}
                </span>
                <span className="text-xs text-slate-400">
                  {currentStatus === 'Active'
                    ? 'Verified profile in active standing'
                    : currentStatus === 'Pending'
                      ? 'Registration pending review'
                      : 'Account currently marked inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#162c54] bg-[#08132b]">
          <span className="text-[11px] text-slate-500 font-mono">
            ID: {contact.id}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-[#050c1e] border border-[#162c54] hover:bg-[#102144] hover:text-[#fdf0d5] rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onEdit(contact)}
              className="px-3.5 py-1.5 text-xs font-bold text-[#fdf0d5] bg-[#1f3e6d] hover:bg-[#28508a] border border-[#2a4e88] rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-[#fdf0d5]" />
              <span>Edit Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
