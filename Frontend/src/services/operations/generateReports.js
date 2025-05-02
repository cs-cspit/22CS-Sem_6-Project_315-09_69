import jsPDF from "jspdf";
import "jspdf-autotable";
import charusat from "../../assets/report logo/charusat.png";
import cspit from "../../assets/report logo/cspit.png";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

// Function to add border to the page
const addBorder = (doc, color = [0, 0, 0], width = 0.5) => {
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(width);
  doc.rect(
    10,
    10,
    doc.internal.pageSize.width - 20,
    doc.internal.pageSize.height - 20
  );
};

// Function to add logos with improved sizing
const addLogos = (doc) => {
  // Increased logo width and adjusted positioning
  doc.addImage(charusat, "PNG", 15, 15, 65, 15); // Increased width from 40 to 60
  doc.addImage(cspit, "PNG", doc.internal.pageSize.width - 45, 15, 30, 15);
};

// PDF Generation Function
export const generatePDF = (reportDetails) => {
  const doc = new jsPDF();
  doc.setFont("helvetica");

  // Function to add consistent page elements
  const preparePage = (doc) => {
    // Add border to the page
    addBorder(doc, [0, 0, 0], 0.7); // Professional blue border

    // Add logos
    addLogos(doc);

    // Add page number
    const pageCount = doc.internal.getNumberOfPages();
    doc.setPage(doc.internal.getNumberOfPages());
    doc.setFontSize(10);
    doc.text(`Page ${pageCount}`, 190, 280, { align: "right" });
  };

  // First Page
  preparePage(doc);

  // Improved Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0); // Professional blue color
  doc.text("Chandubhai S. Patel Institute of Technology", 105, 45, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black color
  doc.text("Department of Computer Science and Engineering", 105, 53, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.text(
    `${reportDetails.reportMetadata.semester}th Semester Project-IV`,
    105,
    60,
    {
      align: "center",
    }
  );

  // Weekly Report Title with enhanced styling
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("WEEKLY REPORT", 105, 75, { align: "center" });
  doc.setTextColor(0, 0, 0);

  // Project Details Table with improved styling
  doc.setFontSize(10);
  doc.autoTable({
    startY: 85, // Adjusted to provide more space
    body: [
      [
        "Student Names and Roll No:",
        reportDetails.content?.individualWork
          ?.map((work) => `${work.student.name} (${work.student.studentId})`)
          .join(", ") || "N/A",
      ],
      ["Project Mentor:", reportDetails.evaluation?.evaluatedBy.name || "N/A"],
      ["Report Title:", reportDetails.content?.title || "N/A"],
      ["Week Number:", reportDetails.reportMetadata?.weekNumber || "N/A"],
      [
        "Report Period:",
        `${formatDate(
          reportDetails.reportMetadata?.reportPeriod.startDate
        )} to ${formatDate(
          reportDetails.reportMetadata?.reportPeriod.endDate
        )}`,
      ],
    ],
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 3,
      lineColor: [0, 102, 204],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { fontStyle: "bold", fillColor: [240, 240, 240], cellWidth: 50 },
      1: { cellWidth: 130 },
    },
  });

  // Sections with improved formatting and spacing
  const addSection = (doc, title, content, yPosition) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 15, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(content || "N/A", 20, yPosition + 10, { maxWidth: 180 });
  };

  // Add sections with adjusted positioning to prevent overlap
  addSection(doc, "Work Done", reportDetails.content.workDone, 150);
  addSection(
    doc,
    "Individual Work",
    reportDetails.content.individualWork
      .map((task) => `${task.student.studentId}: ${task.work}`)
      .join("\n\n"),
    190
  );

  addSection(doc, "Challenges Faced", reportDetails.content.challenges, 235);

  if (reportDetails.evaluation) {
    // Add new page with consistent border
    doc.addPage();
    preparePage(doc);

    // Plan for Next Week with improved positioning
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("Plan for Next Week", 15, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(
      reportDetails.content.nextWeekPlan || "No plan specified",
      20,
      60,
      {
        maxWidth: 180,
      }
    );

    const rubics = [
      ...reportDetails.evaluation.rubric.criteria.map((rubric) => rubric.title),
    ];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("Assigned Marks:", 15, 75);
    // Evaluation Criteria Table with improved styling
    doc.autoTable({
      head: [
        [
          "Evaluation Criteria",
          ...reportDetails.evaluation.studentMarks.map(
            (student) => student.student.studentId
          ),
        ],
      ],
      body: [
        ...rubics.map((rubric, index) => [
          rubric,
          ...reportDetails.evaluation.studentMarks.map(
            (student) => student.marks[index].score || ""
          ),
        ]),
        [
          "Total (out of 25)",
          ...reportDetails.evaluation.studentMarks.map(
            (student) => student.total || ""
          ),
        ],
      ],
      startY: 80,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3,
        lineColor: [0, 102, 204],
      },
      headStyles: {
        fillColor: [0, 200, 200],
        textColor: [0, 0, 0],
      },
    });

    // Comments Sections with improved formatting
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("Comments for Individual Students:", 15, 160);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(
      reportDetails.evaluation.studentMarks
        .map(
          (student) =>
            `${student.student.name} (${student.student.studentId}): ${student.comments}`
        )
        .join("\n"),
      20,
      170,
      { maxWidth: 180 }
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("Comments from Mentors:", 15, 230);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(reportDetails.evaluation.overallComment || "N/A", 20, 240, {
      maxWidth: 180,
    });
  }

  // Save the PDF
  doc.save(
    `Weekly_Report_Week_${
      reportDetails.reportMetadata.weekNumber || "Unknown"
    }.pdf`
  );
};
