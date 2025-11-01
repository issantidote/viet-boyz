import React, { useState, useEffect } from "react";
import './UserProfile.css';

function UserProfile({ onSubmit, existingData }) {
    const [formData, setFormData] = useState({
        fullName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        preferences: "",
        skills: [],
        availability: [],
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [newAvailability, setNewAvailability] = useState("");

    const states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];

    const skills = [
        "First-Aid", "Animal Handling", "Cooking", "Sewing", "Communication", "Fundraising"
    ];

    // 💡 If there is already entered data, use that data
    useEffect(() => {
        if (existingData) {
            const user = existingData.userProfile[0];
            setFormData({
                fullName: user.FullName || "",
                address1: user.AddressLine || "",
                address2: user.AddressLine2 || "",
                city: user.City || "",
                state: user.State || "",
                zipCode: user.ZipCode || "",
                preferences: user.Preferences || "",
                skills: existingData.skills || [],
                availability: existingData.availability || [],
            });
        }
    }, [existingData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => {
            if (type === "checkbox") {
                const newSkills = checked
                    ? [...prevState.skills, value]
                    : prevState.skills.filter(skill => skill !== value);
                return { ...prevState, [name]: newSkills };
            }
            return { ...prevState, [name]: value };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send PUT request to backend to save data
        if (formData.zipCode.length < 5) {
            alert("Zip Code must be at least 5 digits.");
            return;
        }
        let userId = JSON.parse(localStorage.getItem("user")).id;
        fetch(`http://localhost:5001/api/profile/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData), //send form data
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.errors) {
                console.log(data.errors);
            } else {
                onSubmit(data.profileData);
            }
        })
        .catch((error) => console.error("Error saving user profile:", error));
    };

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };

    const handleAddAvailability = () => {
        if (newAvailability) {
            const date = new Date(newAvailability);
            const formatted = date.toLocaleDateString("en-US");
    
            if (!formData.availability.includes(formatted)) {
                setFormData(prevState => ({
                    ...prevState,
                    availability: [...prevState.availability, formatted]
                }));
            }
            setNewAvailability("");
        }
    };

    const handleRemoveAvailability = (date) => {
        setFormData(prevState => ({
            ...prevState,
            availability: prevState.availability.filter(d => d !== date)
        }));
    };

    return (
        <div className="profile-info-section"> {/* Apply the class here */}
            <form onSubmit={handleSubmit} className="userprofile-form">
                <div>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        maxLength={50}
                        required
                        className="userprofile-input"
                    />
                </div>

                <div>
                    <label>Address 1:</label>
                    <input
                        type="text"
                        name="address1"
                        value={formData.address1}
                        onChange={handleChange}
                        maxLength={100}
                        required
                        className="userprofile-input"
                    />
                </div>

                <div>
                    <label>Address 2:</label>
                    <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                        maxLength={100}
                        className="userprofile-input"
                    />
                </div>

                <div>
                    <label>City:</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        maxLength={100}
                        required
                        className="userprofile-input"
                    />
                </div>

                <div>
                    <label>State:</label>
                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="userprofile-select"
                    >
                        <option value="">Select State</option>
                        {states.map((stateCode) => (
                            <option key={stateCode} value={stateCode}>
                                {stateCode}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Zip Code:</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) { //only numbers
                                setFormData({ ...formData, zipCode: value });
                            }
                        }}
                        maxLength={9}
                        minLength={5}
                        required
                        className="userprofile-input"
                    />
                </div>

                <div>
                    <label>Preferences:</label>
                    <textarea
                        name="preferences"
                        value={formData.preferences}
                        onChange={handleChange}
                        rows="4"
                        cols="50"
                        className="userprofile-textarea"
                    />
                </div>

                <div>
                    <label>Skills:</label>
                    <div className="custom-dropdown-container">
                        <button type="button" className="dropdown-button" onClick={toggleDropdown}>
                            {formData.skills.length === 0
                                ? "Select Skills"
                                : formData.skills.join(", ")}
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-content">
                                {skills.map((skill) => (
                                    <label key={skill} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            id={skill}
                                            name="skills"
                                            value={skill}
                                            checked={formData.skills.includes(skill)}
                                            onChange={handleChange}
                                        />
                                        {skill}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label>Availability:</label>
                    <div>
                        <input
                            type="date"
                            value={newAvailability}
                            onChange={(e) => setNewAvailability(e.target.value)}
                            className="userprofile-input"
                        />
                        <button type="button" onClick={handleAddAvailability} className="add-button">
                            Add Date
                        </button>
                    </div>
                    <ul className="availability-list">
                        {formData.availability.map((date, index) => (
                            <li key={index} className="availability-item">
                                {date}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAvailability(date)}
                                    className="remove-button"
                                >
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default UserProfile;