import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "../styles/components.scss";
import "../styles/colors.scss";
import Banner from "./Banner";

const VolunteerMatching = () => {
    //id number of volunteer
  const [volunteerName, setVolunteerName] = useState('');

  const [volunteer] = useState([]);
  
  //list of all volunteers
  const [volunteers, setVolunteers] =
  //uses dummy placeholder data for now until truly hooked up to the db
  useState([
    {
      fullName: 'Jonathan V',
      address1: 'idk',
      address2: '',
      city: 'Missouri City',
      state: 'Texas',
      zipcode: 'my zip code',
      skills: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      preferences: 'Please don\'t sign me up for an event please please please please please please :( :( :( :( :( :(',
      availability: [new Date(2025, 10, 4).toDateString(), new Date(2025, 10, 6).toDateString(), new Date(2025, 10, 8).toDateString(), new Date(2025, 10, 27).toDateString()]
    },
    {
      fullName: 'Bryant T',
      address1: 'umm',
      address2: '',
      city: 'Houston',
      state: 'Texas',
      zipcode: 'erm',
      skills: [1, 3, 4, 5],
      preferences: 'I\'m down for whatever',
      availability: [new Date(2025, 10, 6).toDateString(), new Date(2025, 10, 8).toDateString(), new Date(2025, 10, 27).toDateString()]
    },
    {
      fullName: 'Isa T',
      address1: 'we are not doxing ourselves lol',
      address2: '',
      city: 'Bellaire',
      state: 'Texas',
      zipcode: 'uhh',
      skills: [2, 7],
      preferences: 'Very much looking forward to volunteering! :)',
      availability: [new Date(2025, 10, 4).toDateString(), new Date(2025, 10, 8).toDateString(), new Date(2025, 10, 27).toDateString()]
    },
    {
      fullName: 'Nathan T',
      address1: 'n/a',
      address2: 'n/a',
      city: 'n/a',
      state: 'Texas',
      zipcode: 'n/a',
      skills: [1,3,4],
      preferences: 'n/a',
      availability: [new Date(2025, 10, 4), new Date(2025, 10, 6), new Date(2025, 10, 27).toDateString()]
    }
  ]);

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

  // Choose what to filter by
  const filters= [
    { id: 1, name: 'Skills' },
    { id: 2, name: 'Date' },
    { id: 3, name: 'Location' }
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

  //various different levels of urgencies
  const urgencies = [
    'Low',
    'Medium',
    'High'
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

  const getVolunteer = () => {
    for(var i = 0; i < volunteers.length; i++)
    {
      if(volunteers[i].fullName === volunteerName)
      {
        return volunteers[i];
      }
    }
    //failsafe but not really.
    return volunteers[0];
  };

  const listSkills = (skillsArray) => {
    var text = "";
    var skill = "";
    for(var i = 0; i < skillsArray.length; i++)
    {
      for(var j = 0; j < availableSkills.length; j++)
      {
        if(availableSkills[j].id == skillsArray[i])
        {
          skill = availableSkills[j].name;
        }
      }
      text = (text.trim() ? text + ", " + skill : skill);
    }
    return text;
  }

  const listAvailabilities = (availabilitiesArray) => {
    var text = "";
    for(var i = 0; i < availabilitiesArray.length; i++)
    {
      text = (text.trim() ? text + ", " + availabilitiesArray[i] : availabilitiesArray[i]);
    }
    return text;
  }

      const getUrgencyClass = (urgency) => {
  switch (urgency) {
    case "High":
      return "volunteer-urgency-high";
    case "Medium":
      return "volunteer-urgency-medium";
    case "Low":
      return "volunteer-urgency-low";
    default:
      return "volunteer-urgency-default";
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
        <div>
          <Banner />
        </div>
        <div className="profile-card">
          {/* Header */}
          <div className="profile-header">
            <h2>&emsp;</h2>
            <h2>Volunteer Matching</h2>
            <p>Match a volunteer with an event!</p>
          </div>

          {/* Form Body */}
          <div className="profile-body">

            {/* Event selection */}
            <div className="mb-5">
              
              <div className="form-group-custom">
                  <label className="form-label-custom">
                    Select a volunteer... <span className="required-asterisk">*</span>
                  </label>
                  <select
                    //name="urgency"
                    //value={formData.urgencies}
                    //onChange={handleInputChange}
                    //className={`form-control-custom ${errors.urgency ? 'error' : ''}`}
                    className="form-control-custom"
                    //id="eventName"
                    name="volunteerName"
                    required
                    value={volunteerName}
                    onChange={(e) => {handleFill(e.target.value); setVolunteerName(e.target.value)}}
                  >
                   <option value="">Please select...</option>
                    {volunteers.map((volunteer, index) => (
                      <option key={index} value={volunteer.fullName}>
                        {volunteer.fullName}
                      </option>
                    ))}
                  </select>
                  {/*
                  if there's any errors, it'll need to be put here
                  */}
                </div>
            </div>

            {/*list volunteer data */
            
            volunteerName.trim() && (
              <div className="profile-body">
                <div className="mb-5">
                  <div className="section-header">
                    <div className="section-icon">
                      <i className="bi bi-person"></i>
                    </div>
                    <h3 className="section-title">Volunteer Information</h3>
                  </div>
                  
                  <div className="form-group-custom">
                    <label className="form-label-custom">
                      Full Name: {volunteerName}
                    </label>
                    <label className="form-label-custom">
                      Address Line 1: {getVolunteer().address1}
                    </label>

                    { //only display address2 if it's there

                      getVolunteer().address2.trim() && (
                    <label className="form-label-custom">
                      Address Line 2: {getVolunteer().address2}
                    </label>

                      )
                    }
                    <label className="form-label-custom">
                      City: {getVolunteer().city}
                    </label>
                    <label className="form-label-custom">
                      State: {getVolunteer().state}
                    </label>
                    <label className="form-label-custom">
                      Zipcode: {getVolunteer().zipcode}
                    </label>
                    <label className="form-label-custom">
                      Skills: {listSkills(getVolunteer().skills)}
                    </label>
                    <label className="form-label-custom">
                      Preferences: {getVolunteer().preferences}
                    </label>
                    <label className="form-label-custom">
                      Availabilities: {listAvailabilities(getVolunteer().availability)}
                    </label>
                  </div>
                </div>
              </div>
              )
            }


            {/* Filters Section */}
            <div className="mb-5">
              
              <div className="form-group-custom">
                <label className="form-label-custom">
                  Filter by...
                </label>
                <div className="skills-container-custom">
                  <div className="skills-grid-custom">
                    {filters.map(filter => (
                      <div key={filter.id} className="skill-item-custom">
                        <input
                          type="checkbox"
                          className="skill-checkbox-custom"
                          id={`skill-${filter.id}`}
                          checked={formData.skills.includes(filter.id)}
                          onChange={() => handleSkillToggle(filter.id)}
                        />
                        <label className="form-label-custom" htmlFor={`skill-${filter.id}`} style={{margin: 0}}>
                          {filter.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/*display all events for now*/}
            {/*list volunteer data */
            
            volunteerName.trim() && (
              <div className="volunteer-table-container">
                <table className="volunteer-table">
                  <thead className="volunteer-table-header">
                    <tr>
                      <th>Event Name</th>
                      <th>Description</th>
                      <th>Location</th>
                      <th>Required Skills</th>
                      <th>Urgency</th>
                      <th>Date</th>
          
                    </tr>
                  </thead>
                  <tbody>
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="volunteer-empty-state">
                          No volunteer history yet. Start volunteering to see your activities here!
                        </td>
                      </tr>
                    ) : (
                      events.map((event, idx) => (
                        <tr key={idx}>
                          <td className="volunteer-event-name">
                            {event.eventName}
                          </td>
                          <td className="volunteer-description">
                            {event.eventDescription}
                          </td>
                          <td className="volunteer-location">
                            {event.location}
                          </td>
                          <td className="volunteer-location">
                            {listSkills(event.skills)}
                          </td>
                          <td>
                            <span className={`volunteer-badge ${getUrgencyClass(event.urgency)}`}>
                              {event.urgency}
                            </span>
                          </td>
                          <td className="volunteer-location">
                            {event.eventDate.toDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              )
            }


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

export default VolunteerMatching;