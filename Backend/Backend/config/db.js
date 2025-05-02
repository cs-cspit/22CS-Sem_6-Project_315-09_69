// config/db.js
import mongoose from 'mongoose';
import Project from '../model/Project.js';
import  Technology from '../model/Technology.js';
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {  
    });
   
    // const projects = await Project.find();
    // const getTechnologyName = async (techId) => {
    //   const technology = await Technology.findById(techId);
    //   return technology ? technology.name : 'Unknown';
    // };

    // for (const project of projects) {
    //   const updatedTechnologies = await Promise.all(
    //     project.technologies.map(async (techId) => {
    //       return {
    //         technologyId: techId,
    //         name: await getTechnologyName(techId),
    //         category: null, // Add a default or calculated value if necessary
    //         isCustom: false,
    //         customInput: null,
    //       };
    //     })
    //   );

    //   // Update the project with the new structure
    //   project.technologies = updatedTechnologies;
    //   await project.save();
    //   console.log(`Updated project: ${project._id}`);
    // }

    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;