import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Contact } from '../types/contact';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contact: Contact | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  contact,
}) => {
  if (!isOpen || !contact) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020612]/80 backdrop-blur-xs animate-in fade-in duration-150"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="w-full max-w-sm bg-[#0c1836] border border-[#1f3e6d] rounded-xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-full bg-[#28131d] border border-[#6b1e32] flex items-center justify-center text-[#fca5a5] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="delete-dialog-title" className="text-sm font-bold text-[#fdf0d5]">
              Delete Contact Record
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-200">{contact.name}</span> ({contact.email})? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-[#050c1e] border border-[#162c54] hover:bg-[#102144] hover:text-[#fdf0d5] rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#991b1b] hover:bg-[#b91c1c] rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
};
