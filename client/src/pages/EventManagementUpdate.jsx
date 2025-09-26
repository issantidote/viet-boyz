import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "../styles/components.scss";
import "../styles/colors.scss";

const EventManagementNew = () => {
  //used when getting the specific event to edit
  const [eventName, setEventName] = useState(null);
  //set to true if there is an event to edit (successfully selected)
  const [eventFound, setEventFound] = useState(false);
  //the events, pulled from DB
  const [events, setEvents] = //useState(null);
  //because backend and db is not set up yet, this will serve as placeholder data
  useState([
    {
      eventID: 1,
      eventName: 'fitness gram pacer test',
      eventDescription: 'The FitnessGram Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly but gets faster each minute after you hear this signal. A single lap should be completed every time you hear this sound. Remember to run in a straight line and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark. Get ready! Start.',
      location: 'UH Rec Center',
      skills: [1, 4],
      urgency: 'Medium',
      eventDate: new Date(2025, 10, 4, 12, 15)
    },
    {
      eventID: 2,
      eventName: 'i dunno',
      eventDescription: 'i really am not sure what to put',
      location: 'PGH room 212',
      skills: [2, 3],
      urgency: 'Low',
      eventDate: new Date(2025, 10, 6, 17, 15)
    },
    {
      eventID: 3,
      eventName: 'chasing squirrels',
      eventDescription: 'the squirrels on campus are so fat, so we need to chase them so that they can be skinny legends',
      location: 'In front of the Library',
      skills: [1, 4, 10],
      urgency: 'High',
      eventDate: new Date(2025, 10, 8, 2, 35)
    }
  ]);

  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    location: '',
    skills: [],
    urgency: '',
    eventDate: ''
  });

  const [errors, setErrors] = useState({});

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

  //various different levels of urgencies
  const urgencies = [
    { id: '', name: 'Please determine event urgency.' },
    { id: 'Low', name: 'Low' },
    { id: 'Medium', name: 'Medium' },
    { id: 'High', name: 'High' },
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
    else if (formData.eventName.length > 100) newErrors.fullName = 'Event name must be 100 characters or less';

    if (!formData.eventDescription.trim()) newErrors.eventDescription = 'Event description is required';

    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';

    if (!formData.urgency.trim()) newErrors.eventName = 'Urgency is required';

    if (!formData.date.trim()) newErrors.eventName = 'Date is required';

    //if (formData.availability.length === 0) newErrors.availability = 'At least one availability date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Event saved successfully!');
    }
  };

  const handleCancel = () => {
    setFormData({
    eventName: '',
    eventDescription: '',
    location: '',
    skills: [],
    urgency: '',
    eventDate: ''
    });
    setErrors({});
  };

  const handleFill = () => {
    setFormData({
    eventName: eventName,
    eventDescription: eventName,
    location: eventName,
    skills: [1,4],
    urgency: 'High',
    eventDate: new Date(2025, 10, 4, 12, 15)
    });
  };

  return (
    <>

      <div className="profile-container">
        <div className="card profile-card">
          {/* Header */}
          <div className="profile-header">
            <h2>Event Management</h2>
            <p>Edit An Event</p>
          </div>

          {/* Form Body */}
          <div className="profile-body">

            {/* Event selection */}
            <div className="mb-5">
              
              <div className="form-group-custom">
                  <label className="form-label-custom">
                    Select an event to edit... <span className="required-asterisk">*</span>
                  </label>
                  <select
                    //name="urgency"
                    //value={formData.urgencies}
                    //onChange={handleInputChange}
                    //className={`form-control-custom ${errors.urgency ? 'error' : ''}`}
                    className="form-control-custom"
                    //id="eventName"
                    name="eventName"
                    required
                    value={eventName}
                    onChange={(e) => {setEventName(e.target.value); handleFill(e.target.value)}}
                  >
                   <option value="">Please select...</option>
                    {events.map((event, index) => (
                      <option key={index} value={event.eventName}>
                        {event.eventName}
                      </option>
                    ))}
                  </select>
                  {/*
                  if there's any errors, it'll need to be put here (reference urgencies)
                  */}
                </div>
            </div>

            {/*  Event */}
            <div className="mb-5">  
              <div className="form-group-custom">
                <label className="form-label-custom">
                  <Link to="/event-management">Create A New Event</Link> <span className="required-asterisk">*</span>
                </label>
              </div>
            </div>

            {/*  Event */}
            <div className="mb-5">  
              <div className="form-group-custom">
                <label className="form-label-custom">
                  Event Name <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  maxLength={100}
                  className={`form-control-custom ${errors.eventName ? 'error' : ''}`}
                  placeholder="Enter the name of the Event"
                />
                {errors.eventName && (
                  <div className="error-message-custom">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.eventName}
                  </div>
                )}
              </div>
            </div>


            {/* Description Section */}
            <div className="mb-5">  
              <div className="form-group-custom">
                <label className="form-label-custom">
                  Description<span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleInputChange}
                  /*maxLength={100}    there is no max length for this*/
                  className={`form-control-custom ${errors.eventDescription ? 'error' : ''}`}
                  placeholder="Enter event description..."
                />
                {errors.eventDescription && (
                  <div className="error-message-custom">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.eventDescription}
                  </div>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-5">  
              <div className="form-group-custom">
                <label className="form-label-custom">
                  Location <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  /*maxLength={100}    there is no max length for this*/
                  className={`form-control-custom ${errors.location ? 'error' : ''}`}
                  placeholder="Enter event location..."
                />
                {errors.location && (
                  <div className="error-message-custom">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.location}
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-5">
              
              <div className="form-group-custom">
                <label className="form-label-custom">
                  Skills <span className="required-asterisk">*</span>
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
            </div>

            {/* Urgency Section */}
            <div className="mb-5">
              
              <div className="form-group-custom">
                  <label className="form-label-custom">
                    Urgency <span className="required-asterisk">*</span>
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgencies}
                    onChange={handleInputChange}
                    className={`form-control-custom ${errors.urgency ? 'error' : ''}`}
                  >
                    {urgencies.map(urgency => (
                      <option key={urgency.code} value={urgency.code}>
                        {urgency.name}
                      </option>
                    ))}
                  </select>
                  {errors.urgency && (
                    <div className="error-message-custom">
                      <i className="bi bi-exclamation-circle"></i>
                      {errors.urgency}
                    </div>
                  )}
                </div>
                {errors.urgencies && (
                  <div className="error-message-custom">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.urgencies}
                  </div>
                )}
            </div>

            {/* Date Section */}
            <div className="mb-5">
              <div className="section-header">
                <h3 className="section-title">Date</h3>
              </div>


              <div className="form-group-custom">
                <label className="form-label-custom">
                  Date of Event <span className="required-asterisk">*</span>
                </label>
                <input
                  type="date"
                  //onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="form-control-custom"
                  style={{maxWidth: '250px'}}
                />

                {errors.date && (
                  <div className="error-message-custom">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.date}
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

export default EventManagementNew;