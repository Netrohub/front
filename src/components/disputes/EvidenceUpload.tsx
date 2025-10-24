import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, File, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface EvidenceUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number;
}

export const EvidenceUpload = ({ 
  files, 
  onFilesChange, 
  maxFiles = 5, 
  maxSize = 5 * 1024 * 1024 
}: EvidenceUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      // Check file size
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Max size is 5MB.`);
        continue;
      }

      // Check file type
      if (!file.type.match(/^(image\/(jpeg|jpg|png)|application\/pdf)$/)) {
        toast.error(`File ${file.name} is not a supported format (JPG, PNG, PDF).`);
        continue;
      }

      // Check max files
      if (files.length + validFiles.length >= maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed.`);
        break;
      }

      validFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      });
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
      toast.success(`${validFiles.length} file(s) uploaded successfully.`);
    }
  }, [files, maxFiles, maxSize, onFilesChange]);

  const removeFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      URL.revokeObjectURL(file.url);
    }
    onFilesChange(files.filter(f => f.id !== id));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      <Card
        className={`glass-card p-8 border-2 border-dashed transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-2">Upload Evidence</h3>
            <p className="text-sm text-foreground/60 mb-4">
              Drag and drop files here, or click to select
            </p>
            <p className="text-xs text-foreground/40">
              Supported formats: JPG, PNG, PDF (Max {maxFiles} files, 5MB each)
            </p>
          </div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
          <label htmlFor="file-upload">
            <Button type="button" variant="outline" className="glass-card border-primary/30" asChild>
              <span>Select Files</span>
            </Button>
          </label>
        </div>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Uploaded Files ({files.length}/{maxFiles})</h4>
          {files.map((file) => (
            <Card key={file.id} className="glass-card p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <File className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-foreground/60">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(file.id)}
                  className="text-destructive hover:text-destructive flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
