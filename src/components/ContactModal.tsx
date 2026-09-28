import React, { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Activity,
  Upload,
  Trash2,
  Calendar,
  HeartHandshake,
} from "lucide-react";
import { Contact, Gender } from "../types/contact";

interface ContactModalProps {
  isOpen: boolean;
  contacts: Contact[];
  onClose: () => void;
  onSave: (contactData: Omit<Contact, "id" | "createdAt">) => void;
  contactToEdit?: Contact | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  contacts,
  onClose,
  onSave,
  contactToEdit,
}) => {
  const isEditMode = Boolean(contactToEdit);

  // Form field states
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(30);
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState<Gender>("Female");
  const [status, setStatus] = useState<string>("Active");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with selected contact when modal opens
  useEffect(() => {
    if (contactToEdit) {
      setName(contactToEdit.name || "");
      setAge(contactToEdit.age ?? 30);
      setEmail(contactToEdit.email || "");
      setContactNumber(contactToEdit.contactNumber || "");
      setAddress(contactToEdit.address || "");
      setStatus(contactToEdit.status || "Active");
      setAvatarUrl(contactToEdit.avatarUrl || "");
      setGender(contactToEdit.gender === "Male" ? "Male" : "Female");
    } else {
      setName("");
      setAge(30);
      setEmail("");
      setContactNumber("");
      setAddress("");
      setGender("Female");
      setStatus("Active");
      setAvatarUrl("");
    }
    setErrors({});
  }, [contactToEdit, isOpen]);

  if (!isOpen) return null;

  // Photo upload simulation (FileReader to base64)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Image size should be under 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result;
      if (typeof result === "string") {
        setAvatarUrl(result);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.avatar;
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Field validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (age === undefined || age === null || isNaN(age)) {
      newErrors.age = "Age is required";
    } else if (age < 1 || age > 120) {
      newErrors.age = "Please enter a valid age between 1 and 120";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    } else {
      const normalizeEmail = (value: string) =>
        value.replace(/\s+/g, "").toLowerCase();
      const normalizedEmail = normalizeEmail(email);
      const duplicateExists = contacts.some(
        (contact) =>
          contact.id !== contactToEdit?.id &&
          normalizeEmail(contact.email) === normalizedEmail,
      );

      if (duplicateExists) {
        newErrors.email =
          "This email already exists. Please use a different email address.";
      }
    }

    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (contactNumber.replace(/\D/g, "").length < 6) {
      newErrors.contactNumber =
        "Please enter a valid phone number (min 6 digits)";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name: name.trim(),
      age: Number(age),
      email: email.trim().toLowerCase(),
      contactNumber: contactNumber.trim(),
      gender: gender,
      address: address.trim(),
      status: status,
      avatarUrl: avatarUrl || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020612]/80 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-headline"
    >
      <div className="w-full max-w-lg bg-[#0c1836] border border-[#1f3e6d] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#162c54] bg-[#08132b]">
          <div>
            <h2
              id="contact-modal-headline"
              className="text-base font-bold text-[#fdf0d5]"
            >
              {isEditMode ? "Edit Contact" : "Add New Contact"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in the person&apos;s photo, personal information, address,
              and status.
            </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Profile Photo Upload */}
          <div className="p-3.5 bg-[#050c1e] border border-[#162c54] rounded-xl">
            <label className="block text-xs font-bold text-[#fdf0d5] mb-2">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              {/* Photo Preview */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#162c54] ring-2 ring-[#1f3e6d] bg-[#0c1836] flex items-center justify-center shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-6 h-6 text-slate-400" />
                )}
              </div>

              {/* Upload & Remove Controls */}
              <div className="flex-1 space-y-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                  id="profile-photo-input"
                />
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="profile-photo-input"
                    className="px-3 py-1.5 text-xs font-bold text-[#fdf0d5] bg-[#13274e] border border-[#1f3e6d] rounded-lg hover:bg-[#1a3366] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#fdf0d5]" />
                    <span>{avatarUrl ? "Change Photo" : "Upload Photo"}</span>
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-2.5 py-1.5 text-xs font-semibold text-[#fca5a5] bg-[#24121b] border border-[#5c1d2e] hover:bg-[#3d1827] rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 text-[#fca5a5]" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Recommended square aspect ratio (JPG, PNG, WebP up to 5MB).
                </p>
                {errors.avatar && (
                  <p className="text-xs text-rose-400 font-medium">
                    {errors.avatar}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field 1: Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Full Name <span className="text-[#fdf0d5]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  placeholder="Your name here"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-[#050c1e] border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#fdf0d5] transition-colors ${
                    errors.name
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-[#162c54] focus:border-[#fdf0d5]"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-400 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Field 2: Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Age <span className="text-[#fdf0d5]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => {
                    setAge(parseInt(e.target.value, 10));
                    if (errors.age) setErrors({ ...errors, age: "" });
                  }}
                  placeholder="e.g. 35"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-[#050c1e] border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#fdf0d5] transition-colors ${
                    errors.age
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-[#162c54] focus:border-[#fdf0d5]"
                  }`}
                />
              </div>
              {errors.age && (
                <p className="mt-1 text-xs text-rose-400 font-medium">
                  {errors.age}
                </p>
              )}
            </div>

            {/* Field 3: Email */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Email Address <span className="text-[#fdf0d5]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="Your email here"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-[#050c1e] border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#fdf0d5] transition-colors ${
                    errors.email
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-[#162c54] focus:border-[#fdf0d5]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Field 4: Contact Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Contact Number <span className="text-[#fdf0d5]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => {
                    setContactNumber(e.target.value);
                    if (errors.contactNumber)
                      setErrors({ ...errors, contactNumber: "" });
                  }}
                  placeholder="Your phone number"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-[#050c1e] border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#fdf0d5] transition-colors ${
                    errors.contactNumber
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-[#162c54] focus:border-[#fdf0d5]"
                  }`}
                />
              </div>
              {errors.contactNumber && (
                <p className="mt-1 text-xs text-rose-400 font-medium">
                  {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Field 5: Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Gender <span className="text-[#fdf0d5]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#050c1e] border border-[#162c54] rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#fdf0d5] focus:border-[#fdf0d5] transition-colors cursor-pointer"
                >
                  <option value="Male" className="bg-[#0c1836] text-slate-200">
                    Male
                  </option>
                  <option
                    value="Female"
                    className="bg-[#0c1836] text-slate-200"
                  >
                    Female
                  </option>
                </select>
              </div>
            </div>

            {/* Field 6: Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Address <span className="text-[#fdf0d5]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({ ...errors, address: "" });
                  }}
                  placeholder="Your address location"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-[#050c1e] border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#fdf0d5] transition-colors ${
                    errors.address
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-[#162c54] focus:border-[#fdf0d5]"
                  }`}
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-xs text-rose-400 font-medium">
                  {errors.address}
                </p>
              )}
            </div>

            {/* Field 7: Status */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Status <span className="text-[#fdf0d5]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Activity className="w-4 h-4" />
                </div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#050c1e] border border-[#162c54] rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#fdf0d5] focus:border-[#fdf0d5] transition-colors cursor-pointer"
                >
                  <option
                    value="Active"
                    className="bg-[#0c1836] text-slate-200"
                  >
                    Active
                  </option>
                  <option
                    value="Inactive"
                    className="bg-[#0c1836] text-slate-200"
                  >
                    Inactive
                  </option>
                  <option
                    value="Pending"
                    className="bg-[#0c1836] text-slate-200"
                  >
                    Pending
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons: Save and Cancel */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#162c54]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-[#050c1e] border border-[#162c54] hover:bg-[#102144] hover:text-[#fdf0d5] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#1f3e6d] hover:bg-[#28508a] active:bg-[#162f55] border border-[#2a4e88] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
