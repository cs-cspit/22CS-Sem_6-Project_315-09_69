export const projectApproval = ({
    title,
    type,
    domain,
    semester,
    academicYear,
    studentInfo,
    technologies
}) => {
    // Function to generate student list items
    const generateStudentList = () => {
        return studentInfo.map(student => {
            if (student.isLeader) {
                return `
                    <div style="display: flex; flex-wrap: wrap; align-items: center; margin-bottom: 8px;">
    <span style="background: #4158D0; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; margin-bottom: 4px;">LEADER</span>
    <span style="font-size: 16px; color: #1a1a1a; font-family: 'Poppins', sans-serif;">
        ${student.name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')} (${student.id})
    </span>
</div>`;
            }
            return `<div style="font-size: 16px; color: #1a1a1a; padding-left: 4px; font-family: 'Poppins', sans-serif;">${student.name
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')} (${student.id})</div>`;
        }).join('');
    };

    // Function to generate technology tags
    const generateTechnologyTags = () => {
        return technologies.map(tech => 
            `<span style="background: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; color: #1a1a1a; box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin: 4px; display: inline-block; font-family: 'Poppins', sans-serif;">${tech}</span>`
        ).join('');
    };

    return `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Montserrat:wght@700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; background: #f0f2f5; font-family: 'Poppins', sans-serif; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 600px; margin: 10px auto; background: #ffffff; padding: 0; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; width: 95%;">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%); padding: 30px 20px; text-align: center; color: white;">
            <div style="background: white; width: 100px; height: 100px; margin: 0 auto 20px; border-radius: 50%; padding: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
                <img src="https://charusat.ac.in/images/logo.png" alt="University Logo" style="width: 90px; height: 90px; border-radius: 50%; object-fit: contain;">
            </div>
            <h1 style="margin: 0; font-size: clamp(24px, 5vw, 28px); font-weight: 700; font-family: 'Montserrat', sans-serif;">Project Mentorship Request</h1>
            <p style="margin: 10px 0 0; opacity: 0.9; font-size: clamp(14px, 4vw, 16px);">Academic Year ${academicYear}</p>
        </div>
        
        <div style="padding: 20px;">
            <p style="font-size: 16px; color: #1a1a1a; margin-top: 0; line-height: 1.6;">Dear Faculty,</p>
            
            <p style="font-size: 16px; color: #1a1a1a; line-height: 1.6;">A new team has requested your mentorship for their innovative project.</p>
            
            <!-- Project Details Card -->
            <div style="background: rgba(65, 88, 208, 0.05); border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(65, 88, 208, 0.1);">
                <h2 style="color: #4158D0; margin: 0 0 20px; font-size: 20px; display: flex; align-items: center; font-family: 'Montserrat', sans-serif;">
                    <span style="background: #4158D0; width: 4px; height: 20px; display: inline-block; margin-right: 10px; border-radius: 2px;"></span>
                    Project Details
                </h2>
                <div style="display: grid; grid-gap: 15px;">
                    <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size: 14px; color: #666;">Project Title</div>
                        <div style="font-size: 16px; color: #1a1a1a; font-weight: 500;">${title}</div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); grid-gap: 15px;">
                        <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                            <div style="font-size: 14px; color: #666;">Type</div>
                            <div style="font-size: 16px; color: #1a1a1a;">
                                <span style="background: #4158D0; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${type}</span>
                            </div>
                        </div>
                        <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                            <div style="font-size: 14px; color: #666;">Domain</div>
                            <div style="font-size: 16px; color: #1a1a1a;">${domain}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Team Info Card -->
            <div style="background: rgba(200, 80, 192, 0.05); border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(200, 80, 192, 0.1);">
                <h2 style="color: #C850C0; margin: 0 0 20px; font-size: 20px; display: flex; align-items: center; font-family: 'Montserrat', sans-serif;">
                    <span style="background: #C850C0; width: 4px; height: 20px; display: inline-block; margin-right: 10px; border-radius: 2px;"></span>
                    Team Information
                </h2>
                <div style="display: grid; grid-gap: 15px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); grid-gap: 15px;">
                        <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                            <div style="font-size: 14px; color: #666;">Semester</div>
                            <div style="font-size: 16px; color: #1a1a1a;">${semester}</div>
                        </div>
                    </div>
                    <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                        <div style="font-size: 14px; color: #666;">Team Members</div>
                        <div style="margin-top: 8px;">
                            ${generateStudentList()}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Technologies Card -->
            <div style="background: rgba(255, 204, 112, 0.05); border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(255, 204, 112, 0.1);">
                <h2 style="color: #FFCC70; margin: 0 0 20px; font-size: 20px; display: flex; align-items: center; font-family: 'Montserrat', sans-serif;">
                    <span style="background: #FFCC70; width: 4px; height: 20px; display: inline-block; margin-right: 10px; border-radius: 2px;"></span>
                    Technologies
                </h2>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: -4px;">
                    ${generateTechnologyTags()}
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Charusat University. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};