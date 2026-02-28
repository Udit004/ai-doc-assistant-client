import { apiRequest } from "@/services/http";

export type UploadResponse = {
  id: number;
  title: string;
  filename: string;
  status: string;
  created_at: string;
  updated_at: string;
  chunk_count: number;
};

export async function uploadDocument(
  file: File,
  title?: string,
  token?: string | null,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (title?.trim()) {
    formData.append("title", title.trim());
  }

  return apiRequest<UploadResponse>("/api/v1/upload", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
}
