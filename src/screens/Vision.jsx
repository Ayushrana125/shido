import React, { useState, useEffect } from 'react';
import { PlusIcon } from '../components/Icons';
import { getCurrentUser } from '../auth';
import { uploadVisionImage, saveVisionItem, getVisionItems, deleteVisionItem } from '../visionService';

const Vision = () => {
  const [visionItems, setVisionItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      loadVisionItems();
    }
  }, [user]);

  const loadVisionItems = async () => {
    const { data, error } = await getVisionItems(user.user_id);
    if (!error && data) {
      setVisionItems(data);
    }
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      const { data: uploadData, error: uploadError } = await uploadVisionImage(selectedFile, user.user_id);
      if (uploadError) throw uploadError;

      const { data: saveData, error: saveError } = await saveVisionItem(
        user.user_id,
        uploadData.url,
        uploadData.path,
        caption
      );
      if (saveError) throw saveError;

      setVisionItems([saveData, ...visionItems]);
      setSelectedFile(null);
      setCaption('');
      setShowForm(false);
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    const { error } = await deleteVisionItem(deleteConfirm.vision_id, deleteConfirm.image_path);
    if (!error) {
      setVisionItems(visionItems.filter(v => v.vision_id !== deleteConfirm.vision_id));
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="flex-1 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary via-primary to-secondary pt-safe-top px-4 md:px-8 pb-8">
        <div className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="font-poppins font-bold text-2xl md:text-3xl text-white mb-1">
                Vision Board
              </h1>
              <p className="font-inter text-white/80 text-sm">
                Visualize the life you're building
              </p>
            </div>
            
            {visionItems.length > 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 mt-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-card max-w-md mx-auto">
            <p className="font-inter text-text-secondary">Loading...</p>
          </div>
        ) : visionItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-card max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-secondary to-primary rounded-3xl flex items-center justify-center">
              <span className="text-4xl text-white">🎯</span>
            </div>
            <h3 className="font-poppins font-bold text-xl text-text-primary mb-3">
              Create Your Vision
            </h3>
            <p className="font-inter text-text-secondary mb-2 leading-relaxed">
              Add images here to visualize your future.
            </p>
            <p className="font-inter text-text-secondary mb-8 font-medium">
              Your motivation lives here.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-secondary to-primary text-white px-8 py-4 rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105"
            >
              Add First Image
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 max-w-4xl mx-auto pt-4">
              <h2 className="font-poppins font-bold text-xl md:text-2xl text-text-primary mb-2">
                Your Future
              </h2>
              <p className="font-inter text-text-secondary text-sm">
                A glimpse of what you're working toward
              </p>
            </div>
            
            <div className="columns-2 gap-4 max-w-4xl mx-auto">
              {visionItems.map((item) => (
                <div 
                  key={item.vision_id} 
                  className="bg-white rounded-3xl overflow-hidden shadow-card group cursor-pointer mb-4 break-inside-avoid"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={item.image_url}
                      alt="Vision"
                      className="w-full h-auto block transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjZGN0Y5Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMTQiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+CiAgPC9zdmc+';
                      }}
                    />
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(item);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <p className="font-inter text-text-primary text-sm leading-relaxed">
                      {item.caption || "One day, this will be you"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Add Button */}
      {visionItems.length > 0 && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-32 right-6 w-14 h-14 bg-gradient-to-r from-secondary to-primary rounded-2xl shadow-floating flex items-center justify-center text-white hover:shadow-glow transition-all transform hover:scale-110 z-40"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-card max-h-[90vh] overflow-y-auto">
            <h3 className="font-poppins font-bold text-xl text-text-primary mb-6 text-center">
              Add Vision Image
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block font-inter font-semibold text-text-primary mb-3">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                  required
                />
                {selectedFile && (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-xl"
                    />
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label className="block font-inter font-semibold text-text-primary mb-3">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors h-24 resize-none"
                  placeholder="A future you're choosing to build..."
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedFile(null);
                    setCaption('');
                  }}
                  className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-2xl font-inter font-semibold text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-secondary to-primary text-white rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
             onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage.image_url}
              alt="Vision"
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-card">
            <h3 className="font-poppins font-bold text-xl text-text-primary mb-3 text-center">
              Remove this vision?
            </h3>
            <p className="font-inter text-text-secondary text-sm text-center mb-8">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-2xl font-inter font-semibold text-text-secondary hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-4 px-6 bg-negative text-white rounded-2xl font-inter font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vision;