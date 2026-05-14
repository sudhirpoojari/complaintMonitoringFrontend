import React, { useState, useEffect } from 'react';

export default function CloseComplaintModal({ isOpen, onClose, onSubmit, loading }) {
  const [remark, setRemark] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (photo) {
      const objectUrl = URL.createObjectURL(photo);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [photo]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!photo) {
      setError("Please upload a closing photo.");
      return;
    }
    if (!remark.trim()) {
      setError("Please enter a closing remark.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("remark", remark.trim());
    
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Close Complaint</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">{error}</div>}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Closing Photo <span className="text-red-500">*</span></label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer border border-slate-200 rounded-lg"
            />
            {preview && (
              <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-200 h-40 bg-slate-100 flex items-center justify-center">
                <img src={preview} alt="Preview" className="h-full w-auto object-cover" />
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Closing Remark <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`w-full border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} rounded-lg p-3 text-sm outline-none focus:ring-2 focus:border-transparent transition-all resize-none`}
              rows="4"
              placeholder="Enter detailed closing remark (e.g., Issue resolved successfully)..."
              value={remark}
              onChange={(e) => {
                setRemark(e.target.value);
                if (error) setError("");
              }}
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !remark.trim() || !photo}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Closing Case..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}