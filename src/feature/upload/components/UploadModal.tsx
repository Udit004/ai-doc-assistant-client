"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UploadResponse, uploadDocument } from "../services/upload.service";

interface UploadModalProps {
  onClose: () => void;
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<UploadResponse | null>(null);

  /* Close on Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please choose a file.");
      return;
    }

    try {
      setIsUploading(true);
      const uploadResult = await uploadDocument(file, title, token);
      setResult(uploadResult);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  }

  function handleReset() {
    setTitle("");
    setFile(null);
    setError("");
    setResult(null);
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      aria-modal="true"
      role="dialog"
      aria-label="Upload document"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Panel */}
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-line p-6">
        {/* Close button */}
        <button
          type="button"
          aria-label="Close upload modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-transparent text-muted hover:bg-gray-200 hover:text-foreground transition-colors"
          onClick={onClose}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-foreground mb-1">Upload Document</h2>
        <p className="text-sm text-muted mb-5">
          Supported: PDF, TXT, MD, CSV, JSON, HTML, RST
        </p>

        {!result ? (
          <form className="grid gap-4" onSubmit={handleUpload}>
            <label className="field">
              <span>Document title (optional)</span>
              <input
                type="text"
                placeholder="e.g. Product docs v1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="field">
              <span>File</span>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                accept=".txt,.md,.markdown,.pdf,.json,.csv,.rst,.html,.htm"
              />
            </label>

            {error && <p className="error">{error}</p>}

            <div className="flex gap-3 mt-1">
              <button
                type="button"
                className="flex-1 secondaryButton"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" disabled={isUploading} className="flex-1">
                {isUploading ? "Uploading…" : "Upload"}
              </button>
            </div>
          </form>
        ) : (
          /* Success state */
          <div>
            <div className="flex items-center gap-2 mb-4 text-teal-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="font-semibold">Upload successful!</span>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5">
              <dt className="text-muted text-xs">Document ID</dt>
              <dd className="font-medium">{result.id}</dd>
              <dt className="text-muted text-xs">Filename</dt>
              <dd className="font-medium truncate">{result.filename}</dd>
              <dt className="text-muted text-xs">Status</dt>
              <dd className="font-medium capitalize">{result.status}</dd>
              <dt className="text-muted text-xs">Chunks</dt>
              <dd className="font-medium">{result.chunk_count}</dd>
            </dl>

            <div className="flex gap-3">
              <button type="button" className="flex-1 secondaryButton" onClick={handleReset}>
                Upload another
              </button>
              <button type="button" className="flex-1" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
