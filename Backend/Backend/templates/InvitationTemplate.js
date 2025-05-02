export const groupInvitation = ({
  studentName,
  leaderName,
  department,
  semester,
  mentor,
}) => {
  return `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; background: #F7F7FD; font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 0; border-radius: 16px; box-shadow: 0 4px 20px rgba(74, 58, 255, 0.08); overflow: hidden;">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #4A3AFF 0%, #8C82FF 100%); padding: 40px 30px; text-align: center; color: white;">
            <img src="/api/placeholder/80/80" alt="University Logo" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background: white; padding: 5px;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Group Project Invitation</h1>
            <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Academic Year 2023-24</p>
        </div>
        
        <div style="padding: 30px;">
            <p style="font-size: 16px; color: #170F49; margin-top: 0;">Dear ${
              studentName
            },</p>
            
            <p style="font-size: 16px; color: #170F49;">You have been invited to join a project group by <strong>${
              leaderName
            }</strong>.</p>
            
            <!-- Group Details Card -->
            <div style="background: rgba(74, 58, 255, 0.03); border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid rgba(74, 58, 255, 0.1);">
                <h2 style="color: #4A3AFF; margin: 0 0 20px; font-size: 20px; display: flex; align-items: center;">
                    <span style="background: #4A3AFF; width: 4px; height: 20px; display: inline-block; margin-right: 10px; border-radius: 2px;"></span>
                    Group Details
                </h2>
                <div style="display: grid; grid-gap: 15px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 15px;">
                        <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(74, 58, 255, 0.04);">
                            <div style="font-size: 14px; color: #6F6C90;">Department</div>
                            <div style="font-size: 16px; color: #170F49;">${
                              department
                            }</div>
                        </div>
                        <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(74, 58, 255, 0.04);">
                            <div style="font-size: 14px; color: #6F6C90;">Semester</div>
                            <div style="font-size: 16px; color: #170F49;">${
                              semester
                            }</div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 15px;">
                        <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(74, 58, 255, 0.04);">
                            <div style="font-size: 14px; color: #6F6C90;">Mentor</div>
                            <div style="font-size: 16px; color: #170F49;">${
                              mentor
                            }</div>
                        </div>
                        <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(74, 58, 255, 0.04);">
                            <div style="font-size: 14px; color: #6F6C90;">Group Leader</div>
                            <div style="font-size: 16px; color: #170F49;">${
                              leaderName
                            }</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="background: rgba(74, 58, 255, 0.03); border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid rgba(74, 58, 255, 0.1);">
                <p style="margin: 0; color: #170F49; font-size: 16px;">Please respond to this invitation by clicking one of the buttons below:</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; background: #F7F7FD; color: #6F6C90; font-size: 14px;">
            <p style="margin: 0 0 5px;">This is an automated message. Please do not reply directly to this email.</p>
            <p style="margin: 0;">© ${new Date().getFullYear()} Charusat. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};
