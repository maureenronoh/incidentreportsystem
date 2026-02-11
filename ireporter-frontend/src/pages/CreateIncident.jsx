import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentService } from '../services/incidentService';
import { toast } from 'react-toastify';

const CreateIncident = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'redflag',
    category: '',
    location: '',
    media: null
  });

  // Category options based on incident type
  const categoryOptions = {
    redflag: [
      { value: 'bribery', label: '💰 Bribery', description: 'Offering or accepting bribes' },
      { value: 'embezzlement', label: '💼 Embezzlement', description: 'Theft of public funds' },
      { value: 'fraud', label: '🎭 Fraud', description: 'Deception for financial gain' },
      { value: 'abuse_of_office', label: '👔 Abuse of Office', description: 'Misuse of official position' },
      { value: 'nepotism', label: '👨‍👩‍👧 Nepotism', description: 'Favoritism to relatives' },
      { value: 'conflict_of_interest', label: '⚖️ Conflict of Interest', description: 'Personal interests affecting duties' },
      { value: 'other', label: '🚩 Other Corruption', description: 'Other forms of corruption' }
    ],
    intervention: [
      { value: 'road_infrastructure', label: '🛣️ Road Infrastructure', description: 'Potholes, damaged roads' },
      { value: 'water_supply', label: '💧 Water Supply', description: 'Water shortage, contamination' },
      { value: 'electricity', label: '⚡ Electricity', description: 'Power outages, faulty lines' },
      { value: 'waste_management', label: '🗑️ Waste Management', description: 'Garbage collection issues' },
      { value: 'public_transport', label: '🚌 Public Transport', description: 'Transport service problems' },
      { value: 'healthcare', label: '🏥 Healthcare', description: 'Medical facility issues' },
      { value: 'education', label: '🎓 Education', description: 'School infrastructure problems' },
      { value: 'security', label: '🚨 Security', description: 'Safety and security concerns' },
      { value: 'other', label: '🔧 Other Service', description: 'Other public service issues' }
    ]
  };

  const handleChange = (e) => {
    if (e.target.name === 'media') {
      setFormData({
        ...formData,
        media: e.target.files[0]
      });
    } else if (e.target.name === 'type') {
      // Reset category when type changes
      setFormData({
        ...formData,
        type: e.target.value,
        category: ''
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        location: formData.location
      };

      console.log('Submitting incident:', submitData);
      
      const response = await incidentService.createIncident(submitData);
      console.log('Response:', response);
      
      toast.success('Incident reported successfully!');
      navigate('/incidents');
    } catch (error) {
      console.error('Error creating incident:', error);
      console.error('Error response:', error.response);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to report incident';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const typeDescriptions = {
    redflag: 'Report corruption, bribery, or other illegal activities by public officials',
    intervention: 'Report infrastructure issues, public service problems, or community concerns'
  };

  const currentCategories = categoryOptions[formData.type];

  // Inline Styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', // Dark blue gradient
    padding: '40px 20px'
  };

  const cardStyle = {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    padding: '40px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '10px'
  };

  const subtitleStyle = {
    color: '#6b7280',
    fontSize: '16px'
  };

  const formGroupStyle = {
    marginBottom: '25px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    transition: 'border-color 0.3s',
    outline: 'none'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    backgroundColor: 'white'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '30px'
  };

  const buttonStyle = {
    flex: 1,
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s'
  };

  const submitButtonStyle = {
    ...buttonStyle,
    backgroundColor: loading ? '#9ca3af' : '#10b981',
    color: 'white'
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6b7280',
    color: 'white'
  };

  const descriptionBoxStyle = {
    backgroundColor: '#f3f4f6',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#4b5563',
    marginTop: '8px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>📝 Report New Incident</h1>
          <p style={subtitleStyle}>Help make your community safer and more transparent</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Incident Type */}
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="type">
              Incident Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              style={selectStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="redflag">🚩 Red Flag (Corruption)</option>
              <option value="intervention">🔧 Intervention (Public Service)</option>
            </select>
            <div style={descriptionBoxStyle}>
              ℹ️ {typeDescriptions[formData.type]}
            </div>
          </div>

          {/* Category */}
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="category">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              style={selectStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="">Select a category...</option>
              {currentCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {formData.category && (
              <div style={descriptionBoxStyle}>
                ℹ️ {currentCategories.find(c => c.value === formData.category)?.description}
              </div>
            )}
          </div>

          {/* Title */}
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="title">
              Incident Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Brief, clear description of the incident"
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Location */}
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="location">
              Location *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Where did this incident occur?"
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
              📍 Be as specific as possible (e.g., "Main Street near City Hall")
            </div>
          </div>

          {/* Description */}
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="description">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              style={textareaStyle}
              placeholder="Provide detailed information about what happened, when it occurred, who was involved, and any other relevant details..."
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
              💡 Include dates, times, names (if known), and any other relevant details
            </div>
          </div>

          {/* Media Upload */}
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="media">
              Evidence (Photo/Video)
            </label>
            <input
              id="media"
              name="media"
              type="file"
              accept="image/*,video/*"
              onChange={handleChange}
              style={inputStyle}
            />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
              📎 Optional: Upload photos or videos as evidence
            </div>
          </div>

          {/* Action Buttons */}
          <div style={buttonGroupStyle}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={cancelButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={submitButtonStyle}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#059669')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#10b981')}
            >
              {loading ? 'Reporting...' : '📤 Submit Report'}
            </button>
          </div>

          {/* Privacy Notice */}
          <div style={{
            marginTop: '25px',
            padding: '15px',
            backgroundColor: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px', marginRight: '10px' }}>🔒</span>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#1e40af', fontSize: '14px', fontWeight: '600' }}>
                  Your Privacy Matters
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#1e40af', lineHeight: '1.5' }}>
                  Your report will be reviewed by administrators. You can track its status from your dashboard.
                  For anonymous reporting, use the public reporting form.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIncident;
