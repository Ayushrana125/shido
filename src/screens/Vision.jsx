import React, { useState } from 'react';
import { PlusIcon } from '../components/Icons';
import { getState, setState } from '../store';

const Vision = () => {
  const [state, setStateLocal] = useState(getState());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ imageUrl: '', caption: '' });

  const updateState = (newState) => {
    setState(newState);
    setStateLocal(newState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVisionItem = {
      id: Date.now(),
      imageUrl: formData.imageUrl,
      caption: formData.caption
    };

    updateState({
      ...state,
      vision: [...state.vision, newVisionItem]
    });

    setFormData({ imageUrl: '', caption: '' });
    setShowForm(false);
  };

  const deleteVisionItem = (id) => {
    updateState({
      ...state,
      vision: state.vision.filter(item => item.id !== id)
    });
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
                Visualize your future self
              </p>
            </div>
            
            {state.vision.length > 0 && (
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

      <div className="px-4 md:px-8 -mt-4">
        {state.vision.length === 0 ? (
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
            <div className="mb-6 max-w-4xl mx-auto">
              <h2 className="font-poppins font-bold text-xl md:text-2xl text-text-primary mb-2">
                Your Vision
              </h2>
              <p className="font-inter text-text-secondary text-sm">
                {state.vision.length} {state.vision.length === 1 ? 'image' : 'images'} of your future
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 max-w-6xl mx-auto">
              {state.vision.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-card group">
                  <div className="relative aspect-square">
                    <img
                      src={item.imageUrl}
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjZGN0Y5Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMTQiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+CiAgPC9zdmc+';
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteVisionItem(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-negative/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <p className="font-inter text-text-primary text-sm leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Add Button */}
      {state.vision.length > 0 && (
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
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="mb-8">
                <label className="block font-inter font-semibold text-text-primary mb-3">
                  Caption
                </label>
                <textarea
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors h-24 resize-none"
                  placeholder="Describe your vision..."
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-2xl font-inter font-semibold text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-secondary to-primary text-white rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105"
                >
                  Add Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vision;