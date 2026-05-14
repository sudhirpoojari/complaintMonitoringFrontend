import React from "react";

export default function ActivityTimeline({ activities, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900 bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Complaint History</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {activities && activities.length > 0 ? (
            <div className="relative border-l-2 border-blue-200 ml-4">
              {activities.map((act, index) => (
                <div key={index} className="mb-8 ml-6 last:mb-0">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-[17px] ring-4 ring-white">
                    <div className={`w-3 h-3 rounded-full ${act.actionType.includes("Closed") ? 'bg-red-500' : act.actionType.includes("Completed") ? 'bg-green-500' : 'bg-blue-600'}`}></div>
                  </span>
                  
                  <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                    <h4 className="flex items-center mb-1 text-md font-bold text-slate-900">
                      {act.actionType}
                    </h4>
                    <time className="block mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                      {new Date(act.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </time>
                    
                    {act.remark && (
                      <p className="mb-3 text-sm font-normal text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 border-l-4 border-l-blue-500">
                        "{act.remark}"
                      </p>
                    )}
                    
                    {act.photo && (
                      <img src={act.photo} alt="Activity Evidence" className="rounded-lg max-h-40 w-full object-cover border border-slate-200 shadow-sm" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
              <p className="italic">No activity history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}