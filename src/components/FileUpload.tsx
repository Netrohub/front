import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File, Image, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  onFilesUploaded?: (files: File[]) => void;
  multiple?: boolean;
}

const FileUpload = ({
  accept = "image/*",
  maxSize = 5,
  maxFiles = 5,
  onFilesUploaded,
  multiple = true,
}: FileUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                progress,
                status: progress >= 100 ? "completed" : "uploading",
              }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const fileArray = Array.from(newFiles);

      // Check max files limit
      if (files.length + fileArray.length > maxFiles) {
        toast({
          title: "Too Many Files",
          description: `You can only upload up to ${maxFiles} files.`,
          variant: "destructive",
        });
        return;
      }

      // Validate each file
      const validFiles: File[] = [];
      for (const file of fileArray) {
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: `${file.name} exceeds ${maxSize}MB limit.`,
            variant: "destructive",
          });
          continue;
        }

        validFiles.push(file);
      }

      // Create upload entries
      const newUploadedFiles: UploadedFile[] = validFiles.map((file) => {
        const id = Math.random().toString(36).substring(7);
        
        // Create preview for images
        let preview: string | undefined;
        if (file.type.startsWith("image/")) {
          preview = URL.createObjectURL(file);
        }

        // Start simulated upload
        setTimeout(() => simulateUpload(id), 100);

        return {
          id,
          file,
          preview,
          progress: 0,
          status: "uploading" as const,
        };
      });

      setFiles((prev) => [...prev, ...newUploadedFiles]);
      
      // Notify parent component
      onFilesUploaded?.(validFiles);
    },
    [files.length, maxFiles, maxSize, toast, onFilesUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return Image;
    }
    return File;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card
        className={`glass-card p-8 transition-all ${
          isDragging
            ? "border-primary/50 bg-primary/5 scale-[0.99]"
            : "border-primary/30"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-xl bg-primary/10 border border-primary/20">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isDragging ? "Drop files here" : "Upload Files"}
            </h3>
            <p className="text-sm text-foreground/60 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-glow"
            >
              Select Files
            </Button>
          </div>

          <div className="text-xs text-foreground/50">
            <p>Max file size: {maxSize}MB • Max files: {maxFiles}</p>
            <p>Accepted: {accept}</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </Card>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          {files.map((uploadedFile) => {
            const FileIcon = getFileIcon(uploadedFile.file);
            return (
              <Card key={uploadedFile.id} className="glass-card p-4">
                <div className="flex items-center gap-3">
                  {/* Preview or Icon */}
                  {uploadedFile.preview ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={uploadedFile.preview}
                        alt={uploadedFile.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileIcon className="h-6 w-6 text-primary" />
                    </div>
                  )}

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-semibold text-foreground truncate">
                        {uploadedFile.file.name}
                      </h5>
                      <button
                        onClick={() => removeFile(uploadedFile.id)}
                        className="text-foreground/40 hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-foreground/60 mb-2">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    
                    {/* Progress Bar */}
                    {uploadedFile.status === "uploading" && (
                      <Progress value={uploadedFile.progress} className="h-1" />
                    )}
                    
                    {uploadedFile.status === "completed" && (
                      <div className="flex items-center gap-1 text-primary">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="text-xs">Upload complete</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
