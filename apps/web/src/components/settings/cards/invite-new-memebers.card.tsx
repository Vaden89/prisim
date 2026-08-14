"use client";

import { Button, FormField, Select, SelectItem } from "@repo/ui";
import { Link, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function InviteNewMembersCard() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [invitees, setInvitees] = useState<{ email: string; role: string }[]>(
    [],
  );
  const roles = [
    { value: "DEFAULT", label: "Member" },
    { value: "ADMIN", label: "Admin" },
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!role) {
      setError("Role is required");
      return;
    }

    if (invitees.some((invitee) => invitee.email === trimmedEmail)) {
      setError("This email has already been added");
      return;
    }

    setInvitees((prev) => [...prev, { email: trimmedEmail, role }]);
    setEmail("");
    setRole("");
  };

  const handleRemoveInvitee = (email: string) => {
    setInvitees((prev) => prev.filter((invitee) => invitee.email !== email));
  };

  const handleSendInvitations = () => {
    toast.error("Sending invitations is currently on pause");
  };

  const getRoleLabel = (value: string) =>
    roles.find((role) => role.value === value)?.label ?? value;

  return (
    <div className="w-full p-4 bg-outline-gray-800 border border-[#1F1F20] rounded-2xl flex flex-col justify-between mt-5">
      <div className="w-full flex items-center justify-between">
        <span className="text-secondary leading-[120%] tracking-[-4%]">
          Invite New Members
        </span>
        <button className="text-primary px-4 py-2 rounded-full flex items-center gap-1 text-sm hover:bg-primary/10">
          <Link size={20} />
          <span>Copy Link</span>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-4 mt-4">
        <FormField
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          formFieldClassName="bg-outline-gray-200"
          placeholder="Enter the email of the member you want to invite"
        />
        <Select
          name="role"
          items={roles}
          value={role}
          onValueChange={setRole}
          className="h-11"
          label="Select Role"
          placeholder="Select Role"
        >
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </Select>
        <button
          type="submit"
          aria-label="Add invitee"
          className="w-9 mt-5 flex items-center justify-center shrink-0 h-9 bg-outline-gray-700 text-secondary rounded-full hover:bg-outline-gray-700/70"
        >
          <Plus />
        </button>
      </form>

      {error && (
        <div className="w-full mt-4 p-2 bg-destructive/10 border-destructive border rounded-xl">
          <p className="text-sm text-destructive text-center">{error}</p>
        </div>
      )}

      {invitees.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {invitees.map((invitee) => (
              <div
                key={invitee.email}
                className="flex items-center justify-between gap-3 rounded-xl border border-outline-gray-700 bg-outline-gray-200 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">{invitee.email}</p>
                  <p className="text-xs text-secondary">
                    {getRoleLabel(invitee.role)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${invitee.email}`}
                  onClick={() => handleRemoveInvitee(invitee.email)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-secondary hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={handleSendInvitations}>
              Send Invitations
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
