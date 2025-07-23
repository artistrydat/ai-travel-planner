"use client";

import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Icon } from '../common/Icon';
import { useUIStore } from '../../store/uiStore';
import { useUserStore } from '../../store/userStore';
import { useCreateFeatureRequest } from '../../hooks/useConvexQueries';
import { useToast } from './useToast';

interface FeatureRequestModalProps {
  isOpen: boolean;
}

const FeatureRequestModal: React.FC<FeatureRequestModalProps> = ({ isOpen }) => {
  const { closeFeatureRequestModal } = useUIStore();
  const { user } = useUserStore();
  const createFeatureRequestMutation = useCreateFeatureRequest();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'New Feature',
    priority: 'Medium',
    userEmail: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'New Feature',
    'UI/UX Improvement', 
    'Bug Fix',
    'Integration',
    'Performance',
    'Security',
    'Documentation',
    'Other'
  ];

  const priorities = [
    'Low',
    'Medium', 
    'High',
    'Critical'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast({
        title: 'Error',
        description: 'Please wait for user initialization',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      showToast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createFeatureRequestMutation.mutateAsync({
        userId: user._id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        userEmail: formData.userEmail.trim() || undefined,
      });

      showToast({
        title: 'Success',
        description: 'Feature request submitted successfully! 🚀',
        variant: 'success'
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'New Feature',
        priority: 'Medium',
        userEmail: '',
      });
      
      closeFeatureRequestModal();
    } catch (error) {
      console.error('Failed to submit feature request:', error);
      showToast({
        title: 'Error',
        description: 'Failed to submit feature request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      closeFeatureRequestModal();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Icon name="lightbulb" className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Request Feature</h2>
                <p className="text-indigo-100 text-xs">Help us improve!</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white/70 hover:text-white transition-colors disabled:opacity-50"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-gray-700 mb-1">
              Feature Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Add dark mode support"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="category" className="block text-xs font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                disabled={isSubmitting}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-xs font-semibold text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                disabled={isSubmitting}
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the feature you'd like to see..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-vertical text-sm"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="userEmail" className="block text-xs font-semibold text-gray-700 mb-1">
              Email (Optional)
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-3 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Icon name="send" className="w-3 h-3" />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default FeatureRequestModal;
