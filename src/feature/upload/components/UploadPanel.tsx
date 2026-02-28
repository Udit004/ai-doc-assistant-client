"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UploadResponse, uploadDocument } from "../services/upload.service";

export default function UploadPanel() {
  const { user, token, logout } = useAuth();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<UploadResponse | null>(null);

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

  return (
    <section className="card">
      <header className="flex items-start justify-between mb-5">
        <div>
          <p className="badge">Authenticated</p>
          <h1 className="mt-3 text-2xl font-bold text-foreground">Upload Document</h1>
          <p className="hint">Signed in as {user?.email}</p>
        </div>
        <button type="button" className="secondaryButton shrink-0" onClick={logout}>
          Logout
        </button>
      </header>

      <form className="grid gap-4" onSubmit={handleUpload}>
        <label className="field">
          <span>Document title (optional)</span>
          <input
            type="text"
            placeholder="Product docs v1"
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

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Document"}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      {result ? (
        <section className="result">
          <h2>Upload Result</h2>
          <dl>
            <div>
              <dt>Document ID</dt>
              <dd>{result.id}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{result.status}</dd>
            </div>
            <div>
              <dt>Filename</dt>
              <dd>{result.filename}</dd>
            </div>
            <div>
              <dt>Chunk Count</dt>
              <dd>{result.chunk_count}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      <div className="navActions">
        <Link href="/chat" className="navLinkButton">
          Open Chat Page
        </Link>
      </div>
    </section>
  );
}
