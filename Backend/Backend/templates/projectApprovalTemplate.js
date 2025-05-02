export const projectApprovalTemp = ({
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
                    <div class="team-member leader" style="background: rgba(65, 88, 208, 0.05); border-radius: 16px; padding: 16px; margin-bottom: 16px; border: 1px solid rgba(65, 88, 208, 0.15); display: flex; align-items: center; gap: 16px;">
                        <div style="width: 48px; height: 48px; min-width: 48px; background: linear-gradient(135deg, #4158D0, #C850C0); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 20px;">
                            ${student.name.charAt(0)}
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 4px; flex: 1;">
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <span style="font-size: 16px; color: #2d3748; font-family: 'Poppins', sans-serif; font-weight: 600;">
                                    ${student.name
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                        .join(' ')}
                                </span>
                                <span style="background: linear-gradient(135deg, #4158D0, #C850C0); color: white; padding: 4px 12px; border-radius: 30px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">TEAM LEAD</span>
                            </div>
                            <span style="font-size: 14px; color: #718096; font-weight: 500;">${student.id}</span>
                        </div>
                    </div>`;
            }
            return `
                <div class="team-member" style="background: #f8fafc; border-radius: 16px; padding: 16px; margin-bottom: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 16px;">
                    <div style="width: 48px; height: 48px; min-width: 48px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #4a5568; font-weight: 600; font-size: 20px;">
                        ${student.name.charAt(0)}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <span style="font-size: 16px; color: #2d3748; font-family: 'Poppins', sans-serif; font-weight: 600;">
                            ${student.name
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ')}
                        </span>
                        <span style="font-size: 14px; color: #718096; font-weight: 500;">${student.id}</span>
                    </div>
                </div>`;
        }).join('');
    };

    // Function to generate technology tags
    const generateTechnologyTags = () => {
        return technologies.map(tech => 
            `<span style="background: linear-gradient(135deg, rgba(65, 88, 208, 0.1), rgba(200, 80, 192, 0.1)); padding: 8px 16px; border-radius: 30px; font-size: 14px; color: #2d3748; font-weight: 600; letter-spacing: 0.3px; margin: 4px; display: inline-block; border: 1px solid rgba(65, 88, 208, 0.2);">${tech}</span>`
        ).join('');
    };

    return `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background: #f7fafc; font-family: 'Poppins', sans-serif; -webkit-font-smoothing: antialiased; color: #2d3748;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 0; border-radius: 0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden; width: 100%;">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #4158D0 0%, #C850C0 100%); padding: clamp(24px, 5vw, 40px) 20px; text-align: center; position: relative; overflow: hidden;">
            <!-- Decorative Elements -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, transparent 50%); pointer-events: none;"></div>
            <div style="position: relative;">
                <div style="background: white; width: clamp(80px, 15vw, 100px); height: clamp(80px, 15vw, 100px); margin: 0 auto 24px; border-radius: 50%; padding: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: center;">
                    <img src="https://charusat.ac.in/images/logo.png" alt="University Logo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: contain;">
                </div>
                <h1 style="margin: 0; font-size: clamp(22px, 5vw, 28px); font-weight: 800; font-family: 'Montserrat', sans-serif; letter-spacing: -0.5px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.1); line-height: 1.2;">Project Mentorship Request</h1>
                <p style="margin: 12px 0 0; font-size: clamp(14px, 4vw, 16px); font-weight: 500; color: rgba(255,255,255,0.9);">Academic Year ${academicYear}</p>
            </div>
        </div>
        
        <div style="padding: clamp(16px, 4vw, 24px);">
            <div style="text-align: left; margin-bottom: 24px;">
                <p style="font-size: clamp(16px, 4vw, 18px); color: #2d3748; margin: 0 0 12px; line-height: 1.6; font-weight: 500;">Dear Faculty,</p>
                <p style="font-size: clamp(14px, 3.5vw, 16px); color: #4a5568; line-height: 1.8; font-weight: 400; margin: 0;">A new team has requested your mentorship for their innovative project. Below are the project and team details for your review.</p>
            </div>
            
            <!-- Project Details Card -->
            <div style="background: white; border-radius: 16px; padding: clamp(16px, 4vw, 24px); margin: 24px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.02); border: 1px solid #e2e8f0;">
                <h2 style="color: #4158D0; margin: 0 0 20px; font-size: clamp(20px, 4.5vw, 24px); font-family: 'Montserrat', sans-serif; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                    <span style="display: inline-block; width: 4px; height: 24px; background: linear-gradient(to bottom, #4158D0, #C850C0); border-radius: 2px;"></span>
                    Project Details
                </h2>
                <div style="display: grid; gap: 16px;">
                    <div style="padding: clamp(16px, 4vw, 20px); background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 14px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Project Title</div>
                        <div style="font-size: clamp(16px, 4vw, 18px); color: #2d3748; font-weight: 600;">${title}</div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                        <div style="padding: clamp(16px, 4vw, 20px); background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <div style="font-size: 14px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Type</div>
                            <div style="display: inline-block;">
                                <span style="background: linear-gradient(135deg, #4158D0, #C850C0); color: white; padding: 6px 16px; border-radius: 30px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">${type}</span>
                            </div>
                        </div>
                        <div style="padding: clamp(16px, 4vw, 20px); background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <div style="font-size: 14px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Domain</div>
                            <div style="font-size: clamp(14px, 3.5vw, 16px); color: #2d3748; font-weight: 600;">${domain}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Team Info Card -->
            <div style="background: white; border-radius: 16px; padding: 24px; margin: 24px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.02); border: 1px solid #e2e8f0;">
                <h2 style="color: #C850C0; margin: 0 0 24px; font-size: 24px; font-family: 'Montserrat', sans-serif; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                    <span style="display: inline-block; width: 4px; height: 24px; background: linear-gradient(to bottom, #C850C0, #FFCC70); border-radius: 2px;"></span>
                    Team Information
                </h2>
                <div style="display: grid; gap: 20px;">
                    <div style="padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 14px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Semester</div>
                        <div style="font-size: 18px; color: #2d3748; font-weight: 600;">${semester}</div>
                    </div>
                    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 14px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">Team Members</div>
                        ${generateStudentList()}
                    </div>
                </div>
            </div>

            <!-- Technologies Card -->
            <div style="background: white; border-radius: 16px; padding: 24px; margin: 24px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.02); border: 1px solid #e2e8f0;">
                <h2 style="color: #FFCC70; margin: 0 0 24px; font-size: 24px; font-family: 'Montserrat', sans-serif; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                    <span style="display: inline-block; width: 4px; height: 24px; background: linear-gradient(to bottom, #FFCC70, #4158D0); border-radius: 2px;"></span>
                    Technologies
                </h2>
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: -4px;">
                        ${generateTechnologyTags()}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 24px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #718096; font-size: 14px; font-weight: 500;">© ${new Date().getFullYear()} Charusat University. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};