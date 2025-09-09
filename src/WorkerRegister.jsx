import React, { useState } from "react";
import axios from "axios";

const WorkerRegister = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    name: "",
    location: "",
    gender: "",
    skill: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skill];
    updatedSkills[index] = value;
    setFormData((prev) => ({
      ...prev,
      skill: updatedSkills,
    }));
  };

  const addSkillField = () => {
    setFormData((prev) => ({
      ...prev,
      skill: [...prev.skill, ""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/workers/register", formData);
      alert(res.data.message);
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Worker Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <br /><br />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <br /><br />

        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <br /><br />

        <label>Skills:</label>
        {formData.skill.map((s, index) => (
          <div key={index}>
            <input
              type="text"
              value={s}
              onChange={(e) => handleSkillChange(index, e.target.value)}
              placeholder="Enter a skill"
            />
          </div>
        ))}
        <button type="button" onClick={addSkillField}>+ Add Skill</button>
        <br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default WorkerRegister;
