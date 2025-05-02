// Login API
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Student from "../model/Student.js";
import Faculty from "../model/Faculty.js";

// Login API
export const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    let user = null;
    let userType = "";

    // Determine user type based on email pattern
    if (/^\d+(cs|ce|it|aiml)\d{3}@charusat\.edu\.in$/i.test(email)) {
      // Student email pattern
      user = await Student.findOne({ email });
      userType = "student";
    } else if (/^[a-z]+\.[a-z]+@charusat\.ac\.in$/i.test(email)) {
      // Faculty email pattern
      user = await Faculty.findOne({ email });
      userType = "faculty";
    } else {
      return res.status(400).json({  success:false, message: "Invalid email format" });
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({ success:false, message: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success:false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, type: userType },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    let userData = {};

    if (userType === "student") {
      const nameParts = user.profile?.name?.trim().split(" ") || [];

      // Convert each name part to "Bhalani case"
      const formattedNameParts = nameParts.map(part =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      );
      // bhalani vasu dineshbhai
      // amit  kumar
      // Extract first name and last name in "Bhalani case"
      const firstName = formattedNameParts.length > 1 ? formattedNameParts[formattedNameParts.length - 2] : "";
      const lastName = formattedNameParts.length > 2
        ? formattedNameParts[formattedNameParts.length - 3]
        : formattedNameParts[formattedNameParts.length - 1];

      userData = {
        studentId: user.studentId,
        email: user.email,
        department: user.department,
        batch: user.batch,
        semester: user.semester,
        userType,
        profile: {
          name: formattedNameParts.join(" "), // Full name in Bhalani case
          firstName,
          lastName,
          contact: user.profile?.contact || null,
          avatar: user.profile?.avatar || null,
          bio: user.profile?.bio || null,
        },
      };
    } else if (userType === "faculty") {
      const nameParts = user.profile?.name?.trim().split(" ") || [];

      // Convert each name part to "Bhalani case"
      const formattedNameParts = nameParts.map(part =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      );

      userData = {
        email: user.email,
        department: user.department,
        facultyId: user.facultyId,
        isCoordinator: user.isCoordinator || false,
        userType,
        profile: {
          name: formattedNameParts.join(" "), // Full name in Bhalani case
          contact: user.profile?.contact || null,
          avatar: user.profile?.avatar || null,
          bio: user.profile?.bio || null,
        },
      };
    }

    // Respond with the token and user data
    res.status(200).json({ success:true, message: "Login successful", token, userData });
  } catch (err) {
    console.error(`Login error: ${err.message}`);
    res.status(500).json({ success:false, message: "Internal server error" });
  }
};

// Logout API
export const logout = (req, res) => {
  // For JWT-based systems, logout is typically handled client-side by deleting the token.
  // You can add token invalidation on the server if using a blacklist.
  res.status(200).json({ message: "Logged out successfully" });
};

