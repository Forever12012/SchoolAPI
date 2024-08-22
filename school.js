const express = require("express");
const app = express();
const connection = require("./db");

app.use(express.json());

const validateSchoolData = (name, address, latitude, longitude) => {
  if (!name || typeof name != "string" || name.trim() === "") return false;
  if (!address || typeof address != "string" || address.trim() === "")
    return false;
  if (isNaN(longitude) || longitude < -180 || longitude > 180) return false;
  if (isNaN(latitude) || latitude < -90 || latitude > 90) return false;
  return true; // Return true if all validations pass
};

app.post("/addSchool", (req, res) => {
  const { name, address, longitude, latitude } = req.body;

  if (!validateSchoolData(name, address, longitude, latitude)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const query = `insert into schools (name, address, longitude, latitude) values (?,?,?,?)`;

  connection.query(
    query,
    [name, address, longitude, latitude],
    (err, result) => {
      if (err) {
        console.error("Error inserting school data", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({
        message: "School added succesfully",
        schoolId: result.insertId,
      });
    }
  );
});

// List Schools API
app.get("/listSchools", (req, res) => {
  const { latitude, longitude } = req.query;

  // Validate latitude and longitude
  if (
    !latitude ||
    !longitude ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const query = `
    SELECT id, name, address, latitude, longitude,
           (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
    FROM schools
    ORDER BY distance ASC
  `;

  connection.query(query, [latitude, longitude, latitude], (err, results) => {
    if (err) {
      console.error("Error fetching schools:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ schools: results });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
