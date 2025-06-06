import React, { useEffect, useState } from "react";

// Define the Lead type to match your JSON structure
type Lead = {
  id: string;
  name: string;
  email: string;
};

type LeadsSelectorProps = {
  selectedLeads: Lead[];
  setSelectedLeads: (leads: Lead[]) => void;
  allowSegments?: boolean;
  showBrowseSearch?: boolean;
};

// Fetch leads from /app/leads/sample.json (Next.js route)
// If using Next.js 13+ app directory, use dynamic import for SSR compatibility
export default function LeadsSelector({
  selectedLeads,
  setSelectedLeads,
  allowSegments,
  showBrowseSearch,
}: LeadsSelectorProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // If your leads file is in /public/leads/sample.json, use `/leads/sample.json`
        // If it's in /app/leads/sample.json, you may need an API route to expose it at /api/leads
        const res = await fetch("/leads/sample.json");
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      } catch (e) {
        setLeads([]);
      }
    })();
  }, []);

  // Filter leads by search
  const filteredLeads = search
    ? leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(search.toLowerCase()) ||
          lead.email.toLowerCase().includes(search.toLowerCase())
      )
    : leads;

  const toggleLead = (lead: Lead) => {
    if (selectedLeads.some((l) => l.id === lead.id)) {
      setSelectedLeads(selectedLeads.filter((l) => l.id !== lead.id));
    } else {
      setSelectedLeads([...selectedLeads, lead]);
    }
  };

  return (
    <div className="w-full">
      {showBrowseSearch && (
        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2 w-full px-2 py-1 border rounded"
        />
      )}
      <div className="max-h-44 overflow-auto border rounded p-2 bg-white dark:bg-gray-900">
        {filteredLeads.length === 0 && (
          <div className="text-xs text-gray-400">No leads found.</div>
        )}
        {filteredLeads.map((lead) => (
          <label key={lead.id} className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={selectedLeads.some((l) => l.id === lead.id)}
              onChange={() => toggleLead(lead)}
            />
            <span>
              {lead.name} &lt;{lead.email}&gt;
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}