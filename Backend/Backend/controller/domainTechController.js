import Technology from "../model/Technology.js";

export const getAllDomian = async (req, res) => {
  try {
    const allDomains = await Technology.find({}).select("domain -_id");
    const domains = allDomains.map((item) => ({
      id: item._id,
      name: item.domain
    }));
    res.status(200).send({
      success: true, //changes
      data: domains,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching Domains",
      error: err.message,
    });
  }
};

export const getAllTechnologies = async (req, res) => {
  try {
    // Extract domain from query parameters
    const domain = req.query.domain;

    // Check if domain exists in the query
    if (!domain) {
      return res.status(400).json({ success:false, message: "Domain parameter is required." });
    }

    // Fetch technology data from the database
    const technology = await Technology.findOne({ domain }).select(
      "technologies.name technologies.category -_id"
    );

    // Check if any technologies were found
    if (!technology) {
      return res
        .status(404)
        .json({ success: false, message: "No technologies found for the specified domain." });
    }

    // Respond with the first matched technology data
    res.status(200).json({
      success: true,
      data: technology,
    });
  } catch (err) {
    // Handle server errors
    res.status(500).json({
      success: false,
      message: "Error fetching Technologies",
      error: err.message,
    });
  }
};


export const technologyAPI = async(req,res)=>{ 
  console.log("hi");
  try {
      let response = await fetch('https://api.github.com/languages');
      let data = await response.json();
      res.status(200).json(data);
  } catch (err) {
      console.log("Error:", err);
  }
}

