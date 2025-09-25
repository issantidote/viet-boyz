import React, { useState } from 'react';
import '../styles/components.scss';

const UserProfileManagement = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    skills: [],
    preferences: '',
    availability: []
  });

  const [errors, setErrors] = useState({});

  // US States for dropdown
  const states = [
    { code: '', name: 'Select State' },
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' }
  ];

  // Sample skills - in real app, these would come from API
  const availableSkills = [
    { id: 1, name: 'Event Planning' },
    { id: 2, name: 'Food Service' },
    { id: 3, name: 'Teaching/Tutoring' },
    { id: 4, name: 'Healthcare Support' },
    { id: 5, name: 'Construction/Repair' },
    { id: 6, name: 'Administrative' },
    { id: 7, name: 'Transportation' },
    { id: 8, name: 'Fundraising' },
    { id: 9, name: 'Technology Support' },
    { id: 10, name: 'Animal Care' },
    { id: 11, name: 'Environmental Cleanup' },
    { id: 12, name: 'Customer Service' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSkillToggle = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId]
    }));
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: '' }));
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate && !formData.availability.includes(selectedDate)) {
      setFormData(prev => ({
        ...prev,
        availability: [...prev.availability, selectedDate]
      }));
      if (errors.availability) {
        setErrors(prev => ({ ...prev, availability: '' }));
      }
    }
  };

  const removeDateFromAvailability = (dateToRemove) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter(date => date !== dateToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.length > 50) newErrors.fullName = 'Full name must be 50 characters or less';

    if (!formData.address1.trim()) newErrors.address1 = 'Address is required';
    else if (formData.address1.length > 100) newErrors.address1 = 'Address must be 100 characters or less';

    if (formData.address2.length > 100) newErrors.address2 = 'Address 2 must be 100 characters or less';

    if (!formData.city.trim()) newErrors.city = 'City is required';
    else if (formData.city.length > 100) newErrors.city = 'City must be 100 characters or less';

    if (!formData.state) newErrors.state = 'State is required';

    if (!formData.zipcode.trim()) newErrors.zipcode = 'Zip code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(formData.zipcode)) newErrors.zipcode = 'Enter valid zip code (12345 or 12345-6789)';

    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';

    if (formData.availability.length === 0) newErrors.availability = 'At least one availability date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Profile saved successfully!');
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipcode: '',
      skills: [],
      preferences: '',
      availability: []
    });
    setErrors({});
  };

  return (
    <>
      <div className="profile-container">
        <div className="card profile-card">
          {/* Header */}
          <div className="profile-header">
            <h2>Profile Management</h2>
            <p>Complete your profile to participate in volunteer events</p>
          </div>

          {/* Form Body */}
          <div className="profile-body">
            {/* Personal Information Section */}
            <div className="mb-5">
              <div className="section-header">
                <div className="section-icon">
                  <i className="bi bi-person"></i>
                </div>
                <h3 className="section-title">Personal Information</h3>
              </div>
              
              <div className="form-group-custom">
                <label className="form-label-custom">
                  Full Name <span style={{color: 'rgb(150, 12, 34)'}}>*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  maxLength={50}
                  className={`form-control-custom ${errors.fullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <div className="error-message-custom">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.fullName}
                  </div>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="mb-5">
              <div className="section-header">
                <div className="section-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>
                <h3 className="section-title">Address Information</h3>
              </div>
              
              <div className="form-group-custom">
                <label className="form-label-custom">
                  Address 1 <span style={{color: 'rgb(150, 12, 34)'}}>*</span>
                </label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  maxLength={100}
                  className={`form-control-custom ${errors.address1 ? 'error' : ''}`}
                  placeholder="Enter your street address"
                />
                {errors.address1 && (
                  <div className="error-message-custom">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.address1}
                  </div>
                )}
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Address 2 (Optional)</label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  maxLength={100}
                  className={`form-control-custom ${errors.address2 ? 'error' : ''}`}
                  placeholder="Apartment, suite, etc."
                />
                {errors.address2 && (
                  <div className="error-message-custom">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.address2}
                  </div>
                )}
              </div>

              <div className="form-row-custom">
                <div className="form-group-custom">
                  <label className="form-label-custom">
                    City <span style={{color: 'rgb(150, 12, 34)'}}>*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    maxLength={100}
                    className={`form-control-custom ${errors.city ? 'error' : ''}`}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <div className="error-message-custom">
                      <i className="bi bi-exclamation-circle"></i>
                      {errors.city}
                    </div>
                  )}
                </div>

                <div className="form-group-custom">
                  <label className="form-label-custom">
                    State <span style={{color: 'rgb(150, 12, 34)'}}>*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`form-control-custom ${errors.state ? 'error' : ''}`}
                  >
                    {states.map(state => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <div className="error-message-custom">
                      <i className="bi bi-exclamation-circle"></i>
                      {errors.state}
                    </div>
                  )}
                </div>

                <div className="form-group-custom">
                  <label className="form-label-custom">
                    Zip Code <span style={{color: 'rgb(150, 12, 34)'}}>*</span>
                  </label>
                  <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    maxLength={10}
                    className={`form-control-custom ${errors.zipcode ? 'error' : ''}`}
                    placeholder="12345 or 12345-6789"
                  />
                  {errors.zipcode && (
                    <div className="error-message-custom">
                      <i className="bi bi-exclamation-circle"></i>
                      {errors.zipcode}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-5">
              <div className="section-header">
                <div className="section-icon">
                  <i className="bi bi-gear"></i>
                </div>
                <h3 className="section-title">Skills & Preferences</h3>
              </div>
              
              <div className="form-group-custom">
                <label className="form-label-custom">
                  Skills <span style={{color: 'rgb(150, 12, 34)'}}>*</span>
                </label>
                <div className="skills-container-custom">
                  <div className="skills-grid-custom">
                    {availableSkills.map(skill => (
                      <div key={skill.id} className="skill-item-custom">
                        <input
                          type="checkbox"
                          className="skill-checkbox-custom"
                          id={`skill-${skill.id}`}
                          checked={formData.skills.includes(skill.id)}
                          onChange={() => handleSkillToggle(skill.id)}
                        />
                        <label className="form-label-custom" htmlFor={`skill-${skill.id}`} style={{margin: 0}}>
                          {skill.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {errors.skills && (
                  <div className="error-message-custom">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.skills}
                  </div>
                )}
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Preferences (Optional)</label>
                <textarea
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-control-custom"
                  placeholder="Tell us about your volunteering preferences, schedule constraints, or any other relevant information..."
                  style={{resize: 'vertical'}}
                />
              </div>
            </div>

            {/* Availability Section */}
            <div className="mb-5">
              <div className="section-header">
                <div className="section-icon">
                  <i className="bi bi-calendar"></i>
                </div>
                <h3 className="section-title">Availability</h3>
              </div>
              
              <div className="form-group-custom">
                <label className="form-label-custom">
                  Available Dates <span style={{color: 'rgb(150, 12, 34)'}}>*</span>
                </label>
                <input
                  type="date"
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="form-control-custom"
                  style={{maxWidth: '250px'}}
                />
                
                {formData.availability.length > 0 && (
                  <div style={{marginTop: '20px'}}>
                    <h6 style={{color: 'rgb(84, 88, 90)', marginBottom: '15px'}}>Selected Dates:</h6>
                    <div className="date-tags-custom">
                      {formData.availability.map(date => (
                        <span key={date} className="date-tag-custom">
                          {new Date(date).toLocaleDateString()}
                          <button
                            type="button"
                            onClick={() => removeDateFromAvailability(date)}
                            className="remove-btn-custom"
                            aria-label="Remove date"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {errors.availability && (
                  <div className="error-message-custom">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.availability}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{borderTop: '2px solid rgb(246, 190, 0)', paddingTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px'}}>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-custom btn-secondary-custom"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-custom btn-primary-custom"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Icons CDN */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
        rel="stylesheet"
      />
    </>
  );
};

export default UserProfileManagement;