import React from "react";

// Icons as SVGs (blue folder, bell, dropdown arrow)
const FolderIcon = () => (
  <svg width="28" height="28" fill="none">
    <path d="M4 8a2 2 0 0 1 2-2h5.17a2 2 0 0 1 1.414.586l1.828 1.828A2 2 0 0 0 15.828 9H22a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" fill="#497BFF"/>
    <path d="M2 10a2 2 0 0 1 2-2h8.586a2 2 0 0 1 1.414.586l1.828 1.828A2 2 0 0 0 15.828 11H24a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10Z" fill="#497BFF" fillOpacity=".5"/>
  </svg>
);

const BellIcon = () => (
  <svg width="28" height="28" fill="none">
    <path d="M14 24a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 14 24Zm7-5v-5a7 7 0 0 0-6-6.92V6a1 1 0 0 0-2 0v1.08A7 7 0 0 0 7 14v5l-2 2v1h18v-1l-2-2Z" fill="#497BFF"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="18" height="18" fill="none">
    <path d="M4.5 7.5 9 12l4.5-4.5" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function HeaderLeads() {
  return (
    <header className="flex items-center px-6 py-4 border-b bg-white" style={{minHeight: 64}}>
      <span className="text-lg font-semibold text-[#222] mr-8">Find Leads</span>
      <div className="flex-1 flex justify-center">
        <div className="flex items-center w-[420px]">
          <div className="flex items-center w-full bg-[#F8F8F8] border border-gray-300 rounded-full px-3 py-2">
            <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="search for features, settings and more"
              className="bg-transparent outline-none border-none flex-1 text-base text-gray-700"
              style={{ fontWeight: 500 }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-5 ml-8">
        <button className="rounded-full hover:bg-blue-50 transition p-1">
          <FolderIcon />
        </button>
        <button className="rounded-full hover:bg-blue-50 transition p-1">
          <BellIcon />
        </button>
        <span className="h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow mr-1">
          {/* Use the provided user image */}
          <img
            src="![image1](image1)"
            alt="User"
            className="h-8 w-8 object-cover"
            // Fallback, in case image loading fails
            onError={e => (e.currentTarget.src = "https://randomuser.me/api/portraits/men/32.jpg")}
          />
        </span>
        <ChevronDown />
      </div>
    </header>
  );
}