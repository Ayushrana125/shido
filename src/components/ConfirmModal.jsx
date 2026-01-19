import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, habit }) => {
  if (!isOpen || !habit) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-card transform transition-all">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            habit.type === 'positive' ? 'bg-gradient-to-br from-primary to-secondary' : 'bg-gradient-to-br from-negative to-red-400'
          }`}>
            {habit.iconUrl ? (
              <img src={habit.iconUrl} alt={habit.name} className="w-8 h-8" />
            ) : (
              <span className="text-2xl text-white">
                {habit.type === 'positive' ? '✓' : '⚠'}
              </span>
            )}
          </div>
          
          <h3 className="font-poppins font-bold text-xl text-text-primary mb-2">
            {habit.name}
          </h3>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-poppins font-semibold ${
            habit.type === 'positive' ? 'bg-primary/10 text-primary' : 'bg-negative/10 text-negative'
          }`}>
            {habit.points > 0 ? '+' : ''}{habit.points} points
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-4 mb-8">
          <p className="font-inter text-text-primary text-center leading-relaxed">
            {habit.message}
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-2xl font-inter font-semibold text-text-secondary hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 px-6 rounded-2xl font-inter font-semibold text-white shadow-soft transition-all hover:shadow-card transform hover:scale-105 ${
              habit.type === 'positive' 
                ? 'bg-gradient-to-r from-primary to-secondary' 
                : 'bg-gradient-to-r from-negative to-red-400'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;