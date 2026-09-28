/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { Contact, FilterState, SortColumn, SortState } from "./types/contact";
import {
  migrateLegacyContacts,
  removeContact,
  saveContact,
  subscribeToContacts,
} from "./data/firebase";
import { DataTable } from "./components/DataTable";
import { TableToolbar } from "./components/TableToolbar";
import { PaginationControls } from "./components/PaginationControls";
import { ContactModal } from "./components/ContactModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { ViewMoreDetailsModal } from "./components/ViewMoreDetailsModal";
import { StatsCards } from "./components/StatsCards";
import { GenderDifferenceCard } from "./components/GenderDifferenceCard";
import { ProfileSideCard } from "./components/ProfileSideCard";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { exportToCSV, exportToJSON } from "./utils/export";

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    searchField: "all",
    gender: "all",
  });

  // Sort state: Email by default as first table column
  const [sortState, setSortState] = useState<SortState>({
    column: "email",
    direction: "asc",
  });

  // Pagination state: Default limit is strictly 10 as requested
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals & Drawers state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMoreModalOpen, setIsViewMoreModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Single shared source of truth for the selected contact
  const [selectedContactId, setSelectedContactId] = useState<string>("");

  // Dynamically resolve selected contact record from shared contacts state
  const selectedContact = useMemo(() => {
    if (selectedContactId) {
      const found = contacts.find((c) => c.id === selectedContactId);
      if (found) return found;
    }
    return contacts[0] || null;
  }, [contacts, selectedContactId]);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    migrateLegacyContacts().catch((error: Error) => {
      addToast(
        `Could not migrate saved contacts to Firebase: ${error.message}`,
        "error",
      );
    });
    return subscribeToContacts(
      (updatedContacts) => {
        setContacts(updatedContacts);
        setIsLoadingContacts(false);
      },
      (error) => {
        setIsLoadingContacts(false);
        addToast(`Firebase error: ${error.message}`, "error");
      },
    );
  }, [addToast]);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedText(text);
        addToast(`${label} copied to clipboard`, "info");
        setTimeout(() => setCopiedText(null), 2000);
      },
      () => {
        addToast("Failed to copy text", "error");
      },
    );
  };

  // Gender counts calculation (Male and Female only)
  const genderCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Male: 0,
      Female: 0,
    };
    contacts.forEach((c) => {
      const g = c.gender === "Male" ? "Male" : "Female";
      counts[g] = (counts[g] || 0) + 1;
    });
    return counts;
  }, [contacts]);

  // Handle filter changes and reset page to 1
  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterState({
      searchQuery: "",
      searchField: "all",
      gender: "all",
      dateMonth: null,
      ageRange: null,
    });
    setCurrentPage(1);
    addToast("Filters reset", "info");
  };

  // Handle sorting toggle
  const handleSortChange = (column: SortColumn, direction?: "asc" | "desc") => {
    setSortState((prev) => {
      if (direction) {
        return { column, direction };
      }
      if (prev.column === column) {
        return {
          column,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { column, direction: "asc" };
    });
  };

  // Filtered & Sorted contacts
  const filteredAndSortedContacts = useMemo(() => {
    let result = [...contacts];

    // Filter by Gender
    if (filterState.gender !== "all") {
      result = result.filter(
        (c) => c.gender.toLowerCase() === filterState.gender.toLowerCase(),
      );
    }

    if (filterState.dateMonth) {
      result = result.filter((contact) => {
        if (!contact.createdAt) return false;
        const createdAt = new Date(contact.createdAt);
        return (
          !Number.isNaN(createdAt.getTime()) &&
          createdAt.getUTCMonth() === filterState.dateMonth?.monthIndex &&
          createdAt.getUTCFullYear() === filterState.dateMonth?.year
        );
      });
    }

    if (filterState.ageRange) {
      result = result.filter(
        (contact) =>
          contact.age >= (filterState.ageRange?.min ?? 0) &&
          contact.age <= (filterState.ageRange?.max ?? 120),
      );
    }

    // Filter by Search Query across the 4 columns
    const q = filterState.searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((c) => {
        if (filterState.searchField === "name") {
          return c.name.toLowerCase().includes(q);
        }
        if (filterState.searchField === "email") {
          return c.email.toLowerCase().includes(q);
        }
        if (filterState.searchField === "contactNumber") {
          return c.contactNumber.toLowerCase().includes(q);
        }
        if (filterState.searchField === "gender") {
          return c.gender.toLowerCase().includes(q);
        }
        // 'all' columns
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.contactNumber.toLowerCase().includes(q) ||
          c.gender.toLowerCase().includes(q)
        );
      });
    }

    // Sort by column (Name, Email, Contact Number, Gender)
    result.sort((a, b) => {
      let valA = "";
      let valB = "";

      switch (sortState.column) {
        case "name":
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case "email":
          valA = a.email.toLowerCase();
          valB = b.email.toLowerCase();
          break;
        case "contactNumber":
          valA = a.contactNumber.replace(/\D/g, "");
          valB = b.contactNumber.replace(/\D/g, "");
          break;
        case "gender":
          valA = a.gender.toLowerCase();
          valB = b.gender.toLowerCase();
          break;
      }

      if (valA < valB) return sortState.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortState.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [contacts, filterState, sortState]);

  // Pagination calculation
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedContacts.length / pageSize),
  );

  // Ensure currentPage is within bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedContacts.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedContacts, currentPage, pageSize]);

  // Data management operations
  const handleSaveContact = async (
    data: Omit<Contact, "id" | "createdAt">,
    contactId?: string,
  ) => {
    const existingContact = contactId
      ? contacts.find((contact) => contact.id === contactId)
      : null;
    const savedContact: Contact = {
      ...data,
      id:
        contactId ||
        `ct-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: existingContact?.createdAt || new Date().toISOString(),
    };

    try {
      await saveContact(savedContact);
      setSelectedContactId(savedContact.id);
      addToast(
        `${contactId ? "Updated" : "Added new"} contact "${data.name}"`,
        "success",
      );
    } catch (error) {
      addToast(`Failed to save contact: ${(error as Error).message}`, "error");
    }
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    const name = contactToDelete.name;
    try {
      await removeContact(contactToDelete.id);
      setContactToDelete(null);
      addToast(`Deleted contact "${name}"`, "info");
    } catch (error) {
      addToast(
        `Failed to delete contact: ${(error as Error).message}`,
        "error",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050c1e] text-slate-100 font-sans flex flex-col selection:bg-[#1f3e6d] selection:text-[#fdf0d5]">
      {/* Top Bar: 3-Zone Navigation Header */}
      <header className="bg-[#0c1836] border-b border-[#162c54] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1f3e6d] border border-[#2a4d85] flex items-center justify-center text-[#fdf0d5] shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <a
              href="/"
              className="text-base font-bold tracking-tight text-[#fdf0d5] hover:text-white transition-colors"
            >
              Contacts Directory
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {isLoadingContacts && (
          <p role="status" className="text-xs text-slate-400">
            Connecting to Firebase...
          </p>
        )}
        {/* Reference Metrics Cards: Total Persons Registered, Male Count, Female Count */}
        <StatsCards
          totalCount={contacts.length}
          maleCount={genderCounts["Male"] || 0}
          femaleCount={genderCounts["Female"] || 0}
          activeGenderFilter={filterState.gender}
          onSelectFilter={(gender) => {
            handleFilterChange({ gender });
          }}
        />
        {/* Dashboard Difference between Male and Female Card (Reference 1) */}
        <GenderDifferenceCard
          contacts={contacts}
          activeGenderFilter={filterState.gender}
          onSelectGenderFilter={(gender) => {
            handleFilterChange({ gender });
          }}
          filterState={filterState}
          onFilterChange={handleFilterChange}
        />
        {/* Layout: Profile Cards on the left, Table on the right */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Side: Scrollable panel with all contact profile cards */}
          <ProfileSideCard
            contacts={filteredAndSortedContacts}
            selectedContactId={selectedContact?.id || null}
            onSelectContact={(c) => setSelectedContactId(c.id)}
            onViewMoreDetails={(c) => {
              setSelectedContactId(c.id);
              setIsViewMoreModalOpen(true);
            }}
          />

          {/* Right Side: Table Management Panel, 4-Column Table, and Pagination */}
          <div className="flex-1 min-w-0 w-full space-y-4">
            {/* Table Management Panel: Search bar, Filters, Sort controls */}
            <TableToolbar
              filterState={filterState}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              sortState={sortState}
              onSortChange={handleSortChange}
              totalContacts={contacts.length}
              filteredCount={filteredAndSortedContacts.length}
              genderCounts={genderCounts}
              onOpenAddModal={() => {
                setContactToEdit(null);
                setIsModalOpen(true);
              }}
              onExportCSV={() => {
                exportToCSV(filteredAndSortedContacts);
                addToast("Exported filtered contacts to CSV", "success");
              }}
              onExportJSON={() => {
                exportToJSON(filteredAndSortedContacts);
                addToast("Exported filtered contacts to JSON", "success");
              }}
            />

            {/* The 4-Column Data Table */}
            <section aria-label="Contacts data table" className="space-y-2">
              <DataTable
                contacts={paginatedContacts}
                selectedContactId={selectedContact?.id || null}
                sortState={sortState}
                onSortChange={handleSortChange}
                onSelectContact={(contact) => {
                  setSelectedContactId(contact.id);
                }}
                onEditContact={(contact) => {
                  setSelectedContactId(contact.id);
                  setContactToEdit(contact);
                  setIsModalOpen(true);
                }}
                onDeleteContact={(contact) => setContactToDelete(contact)}
                onCopyText={handleCopyText}
                copiedText={copiedText}
                searchQuery={filterState.searchQuery}
              />

              {/* Pagination Navigation & 10 Limit Controls */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredAndSortedContacts.length}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
              />
            </section>
          </div>
        </div>
      </main>

      {/* View More Details Modal */}
      <ViewMoreDetailsModal
        contact={selectedContact}
        isOpen={isViewMoreModalOpen}
        onClose={() => setIsViewMoreModalOpen(false)}
        onEdit={(contact) => {
          setIsViewMoreModalOpen(false);
          setContactToEdit(contact);
          setIsModalOpen(true);
        }}
        onCopyText={handleCopyText}
        copiedText={copiedText}
      />

      {/* Add / Edit Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        contacts={contacts}
        onClose={() => {
          setIsModalOpen(false);
          setContactToEdit(null);
        }}
        onSave={(data) => handleSaveContact(data, contactToEdit?.id)}
        contactToEdit={contactToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(contactToDelete)}
        onClose={() => setContactToDelete(null)}
        onConfirm={handleDeleteContact}
        contact={contactToDelete}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
