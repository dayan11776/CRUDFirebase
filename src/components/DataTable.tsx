import React from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Copy,
  Check,
  Phone,
  Mail,
} from 'lucide-react';
import { Contact, SortColumn, SortState } from '../types/contact';

interface DataTableProps {
  contacts: Contact[];
  selectedContactId?: string | null;
  sortState: SortState;
  onSortChange: (column: SortColumn) => void;
  onSelectContact: (contact: Contact) => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
  onCopyText: (text: string, label: string) => void;
  copiedText: string | null;
  searchQuery?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  contacts,
  selectedContactId,
  sortState,
  onSortChange,
  onSelectContact,
  onEditContact,
  onDeleteContact,
  onCopyText,
  copiedText,
  searchQuery = '',
}) => {
  // Highlight search text matching query
  const highlightMatch = (text: string | number | undefined) => {
    if (!text) return null;
    const str = String(text);
    if (!searchQuery.trim()) return str;

    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = str.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-[#1f3e6d] text-[#fdf0d5] px-1 py-0.5 rounded font-semibold">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortState.column !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />;
    }
    return sortState.direction === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#fdf0d5] font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#fdf0d5] font-bold" />
    );
  };

  const getAriaSort = (column: SortColumn): 'ascending' | 'descending' | 'none' => {
    if (sortState.column !== column) return 'none';
    return sortState.direction === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className="w-full overflow-hidden border border-[#162c54] rounded-xl bg-[#0c1836] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="table">
          <thead>
            <tr className="border-b border-[#162c54] bg-[#08132b] text-xs font-bold text-slate-300">
              {/* Column 1: Email */}
              <th
                scope="col"
                aria-sort={getAriaSort('email')}
                className="py-3.5 pl-6 pr-4 cursor-pointer select-none group transition-colors hover:bg-[#0c1836]"
                onClick={() => onSortChange('email')}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#fdf0d5]">Email</span>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-[#13274e] focus:outline-none"
                    aria-label={`Sort by Email (${sortState.column === 'email' ? sortState.direction : 'inactive'})`}
                  >
                    {getSortIcon('email')}
                  </button>
                </div>
              </th>

              {/* Column 2: Contact Number */}
              <th
                scope="col"
                aria-sort={getAriaSort('contactNumber')}
                className="py-3.5 px-4 cursor-pointer select-none group transition-colors hover:bg-[#0c1836]"
                onClick={() => onSortChange('contactNumber')}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#fdf0d5]">Contact Number</span>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-[#13274e] focus:outline-none"
                    aria-label={`Sort by Contact Number (${sortState.column === 'contactNumber' ? sortState.direction : 'inactive'})`}
                  >
                    {getSortIcon('contactNumber')}
                  </button>
                </div>
              </th>

              {/* Column 3: Gender */}
              <th
                scope="col"
                aria-sort={getAriaSort('gender')}
                className="py-3.5 px-4 cursor-pointer select-none group transition-colors hover:bg-[#0c1836]"
                onClick={() => onSortChange('gender')}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#fdf0d5]">Gender</span>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-[#13274e] focus:outline-none"
                    aria-label={`Sort by Gender (${sortState.column === 'gender' ? sortState.direction : 'inactive'})`}
                  >
                    {getSortIcon('gender')}
                  </button>
                </div>
              </th>

              {/* Column 4: Actions (Edit & Delete) */}
              <th
                scope="col"
                className="py-3.5 pl-4 pr-6 text-right font-bold text-[#fdf0d5]"
              >
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#14274e] text-sm">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-slate-400 bg-[#0c1836]">
                  <div className="max-w-xs mx-auto flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#050c1e] border border-[#162c54] flex items-center justify-center text-slate-400 mb-3">
                      <Mail className="w-5 h-5 text-[#fdf0d5]" />
                    </div>
                    <p className="font-bold text-[#fdf0d5] text-sm">No contacts found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search query or gender filter to locate records.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              contacts.map((contact) => {
                const isSelected = contact.id === selectedContactId;
                return (
                  <tr
                    key={contact.id}
                    className={`group transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#132852] border-l-4 border-l-[#fdf0d5] shadow-xs'
                        : 'hover:bg-[#0f2144] border-l-4 border-l-transparent'
                    }`}
                    onClick={() => onSelectContact(contact)}
                  >
                    {/* Column 1: Email */}
                    <td className="py-3.5 pl-6 pr-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-[#fdf0d5] shrink-0"
                            title="Selected contact"
                          />
                        )}
                        <a
                          href={`mailto:${contact.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`hover:underline transition-colors flex items-center gap-1.5 font-mono text-xs ${
                            isSelected
                              ? 'text-[#fdf0d5] font-bold'
                              : 'text-slate-200 hover:text-[#fdf0d5]'
                          }`}
                        >
                          <span>{highlightMatch(contact.email)}</span>
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCopyText(contact.email, 'Email');
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-[#fdf0d5] p-0.5 rounded transition-opacity cursor-pointer"
                          title="Copy email address"
                          aria-label={`Copy email ${contact.email}`}
                        >
                          {copiedText === contact.email ? (
                            <Check className="w-3.5 h-3.5 text-[#fdf0d5]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Column 2: Contact Number */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Phone
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? 'text-[#fdf0d5]' : 'text-slate-400'
                          }`}
                          aria-hidden="true"
                        />
                        <a
                          href={`tel:${contact.contactNumber}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`font-mono text-xs tabular-nums transition-colors ${
                            isSelected
                              ? 'text-[#fdf0d5] font-bold'
                              : 'text-slate-200 hover:text-[#fdf0d5]'
                          }`}
                        >
                          {highlightMatch(contact.contactNumber)}
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCopyText(contact.contactNumber, 'Contact Number');
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-[#fdf0d5] p-0.5 rounded transition-opacity cursor-pointer"
                          title="Copy contact number"
                          aria-label={`Copy number ${contact.contactNumber}`}
                        >
                          {copiedText === contact.contactNumber ? (
                            <Check className="w-3.5 h-3.5 text-[#fdf0d5]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Column 3: Gender */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-xs ${
                          isSelected ? 'text-[#fdf0d5] font-bold' : 'text-slate-300 font-medium'
                        }`}
                      >
                        {highlightMatch(contact.gender)}
                      </span>
                    </td>

                    {/* Column 4: Actions (Edit & Delete) */}
                    <td className="py-3.5 pl-4 pr-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditContact(contact);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-[#050c1e] border border-[#1f3e6d] hover:bg-[#162f59] hover:text-[#fdf0d5] rounded-md transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                          title="Edit contact"
                          aria-label={`Edit ${contact.name}`}
                        >
                          <Edit2 className="w-3 h-3 text-[#fdf0d5]" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteContact(contact);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-[#fca5a5] bg-[#24121b] border border-[#5c1d2e] hover:bg-[#3d1827] hover:text-white rounded-md transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                          title="Delete contact"
                          aria-label={`Delete ${contact.name}`}
                        >
                          <Trash2 className="w-3 h-3 text-[#fca5a5]" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
