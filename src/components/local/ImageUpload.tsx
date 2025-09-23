import { Plus, X } from "lucide-react";

interface Props {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  placeholder?: string;
}

const ImageUploadUi = ({
  file,
  setFile,
  placeholder = "Upload Image",
}: Props) => {
  return (
    <div className="flex flex-wrap gap-4">
      {file ? (
        <div className="relative w-52 h-80 rounded-lg overflow-hidden border">
          <img
            src={URL.createObjectURL(file)}
            className="w-full h-full object-cover"
            alt="preview"
          />
          {/* remove/reset button */}
          <button
            type="button"
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
            onClick={() => setFile(null)}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          htmlFor="fileInput"
          className="w-52 h-80 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:border-primary-500 transition"
        >
          <Plus size={28} />
          <p className="text-xs">{placeholder}</p>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            hidden
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploadUi;
