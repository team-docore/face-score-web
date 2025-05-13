// DOCORE: 이미지 업로더 컴포넌트

interface ImageUploaderProps {
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  messages: {
    uploadPhoto: string
    clickToUpload: string
    orPaste: string
  }
}

export default function ImageUploader({ onImageChange, messages }: ImageUploaderProps) {
  return (
    <div className="pt-4 border-t border-zinc-700">
      <p className="text-zinc-300 text-lg mb-4">{messages.uploadPhoto}</p>
      <label className="block w-full">
        <div className="border-2 border-dashed border-zinc-600 rounded-xl p-8 hover:border-pink-500 transition-colors cursor-pointer">
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-zinc-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-zinc-400">{messages.clickToUpload}</p>
            <p className="text-zinc-500 text-sm">{messages.orPaste}</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
        </div>
      </label>
    </div>
  )
} 