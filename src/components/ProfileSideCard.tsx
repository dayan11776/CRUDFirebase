import React from 'react';
import { MapPin, ChevronRight, User, Users } from 'lucide-react';
import { Contact } from '../types/contact';

interface ProfileSideCardProps {
  contacts: Contact[];
  selectedContactId?: string | null;
  onSelectContact?: (contact: Contact) => void;
  onViewMoreDetails: (contact: Contact) => void;
}

export const ProfileSideCard: React.FC<ProfileSideCardProps> = ({
  contacts,
  selectedContactId,
  onSelectContact,
  onViewMoreDetails,
}) => {
  return (
    <aside className="w-full lg:w-80 xl:w-[330px] shrink-0 flex flex-col space-y-3 lg:sticky lg:top-20">
      {/* Header with counter badge */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#fdf0d5]">
          <Users className="w-3.5 h-3.5 text-[#fdf0d5]" />
          <span>Contact Profiles</span>
          <span className="px-1.5 py-0.5 bg-[#1f3e6d] text-[#fdf0d5] rounded-full text-[10px] font-bold font-mono border border-[#2a4e88]">
            {contacts.length}
          </span>
        </div>
        <span className="text-[11px] text-slate-400">Scrollable list</span>
      </div>

      {/* Scrollable Container with fixed maximum height */}
      <div
        className="max-h-[600px] lg:max-h-[calc(100vh-140px)] overflow-y-auto pr-1.5 space-y-3.5 overscroll-contain"
        style={{ scrollbarGutter: 'stable' }}
      >
        {contacts.length === 0 ? (
          <div className="bg-[#0c1836] rounded-2xl border border-[#162c54] p-6 text-center text-slate-400 text-xs shadow-xs">
            No contact profiles found.
          </div>
        ) : (
          contacts.map((contact) => {
            const isSelected = contact.id === selectedContactId;
            const initials = contact.name
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((p) => p[0]?.toUpperCase())
              .join('');

            return (
              <div
                key={contact.id}
                onClick={() => onSelectContact?.(contact)}
                className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between space-y-3.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0e2148] border-2 border-[#fdf0d5] shadow-md ring-2 ring-[#fdf0d5]/20'
                    : 'bg-[#0c1836] border border-[#162c54] hover:border-[#1f3e6d] hover:bg-[#0f1f42] shadow-xs'
                }`}
              >
                {/* Top: Profile Photo, Name, Age, Address */}
                <div className="flex items-start gap-3.5">
                  {/* Profile Photo */}
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#162c54] shadow-xs bg-[#050c1e] flex items-center justify-center shrink-0 ring-1 ring-[#1f3e6d] select-none">
                    {contact.avatarUrl ? (
                      <img
                        src={contact.avatarUrl}
                        alt={contact.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-[#050c1e] to-[#1f3e6d] flex items-center justify-center font-bold text-[#fdf0d5] text-sm">
                        {initials || <User className="w-6 h-6 text-[#fdf0d5]" />}
                      </div>
                    )}
                  </div>

                  {/* Details: Name, Age, Address */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#fdf0d5] text-sm leading-snug truncate">
                      {contact.name}
                    </h3>

                    {/* Age */}
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Age:{' '}
                      <span className="text-slate-200 font-semibold tabular-nums">
                        {contact.age ?? 35}
                      </span>
                    </p>

                    {/* Address */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#fdf0d5]/70 shrink-0" />
                      <span className="truncate">{contact.address || 'New York, USA'}</span>
                    </div>
                  </div>
                </div>

                {/* View More Details Button */}
                <div className="pt-2 border-t border-[#162c54]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectContact?.(contact);
                      onViewMoreDetails(contact);
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-[#fdf0d5] bg-[#1f3e6d] hover:bg-[#28508a] active:bg-[#162f55] rounded-xl transition-all duration-150 shadow-xs flex items-center justify-center gap-1 cursor-pointer border border-[#2a4e88]"
                  >
                    <span>View More Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#fdf0d5]" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
