import axios from "axios";


import { jsPDF } from "jspdf";
import "jspdf-autotable";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip, // ChartJS Tooltip
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const colors = {
  primary: "#2563eb",
  secondary: "#3b82f6",
  success: "#059669",
  warning: "#d97706",
  info: "#0891b2",
  accent1: "#6366f1",
  accent2: "#8b5cf6",
  accent3: "#ec4899",
  background: "#f8fafc",
  chartColors: [
    "#2563eb",
    "#059669",
    "#d97706",
    "#0891b2",
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#ef4444",
  ],
};


export const fetchAllcommites = async (owner, repoName, startDate, endDate) => {
  let allCommits = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}/commits`,
        {
          params: {
            since: `${startDate}T00:00:00Z`,
            until: `${endDate}T23:59:59Z`,
            per_page: 100,
            page: page,
          },
        }
      );

      if (response.data.length === 0) {
        hasMore = false;
      } else {
        console.log(response.data);
        allCommits = [...allCommits, ...response.data];
        page++;
      }
    } catch (error) {
      hasMore = false;
      throw error;
    }
  }

  return allCommits;
};

export const processCommites = (commits, startDate, endDate) => {
  const dailyCommits = {};
  const authorCommits = {};
  const commitMessages = {};
  const authorDetails = {};

  // First pass: collect all unique authors from commits
  commits.forEach((commit) => {
    const author = commit.commit.author.name;
    if (!authorDetails[author]) {
      authorDetails[author] = {
        avatarUrl: commit.author?.avatar_url || null,
        login: commit.author?.login || null,
        latestCommit: commit,
      };
      authorCommits[author] = 0; // Initialize all authors with 0 commits
    }
  });

  // Initialize all days in range
  let currentDate = new Date(startDate);
  const endDateTime = new Date(endDate);
  while (currentDate <= endDateTime) {
    const dateStr = currentDate.toISOString().split("T")[0];
    dailyCommits[dateStr] = 0;
    commitMessages[dateStr] = [];
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Second pass: count commits
  commits.forEach((commit) => {
    const date = commit.commit.author.date.split("T")[0];
    const author = commit.commit.author.name;

    dailyCommits[date] = (dailyCommits[date] || 0) + 1;
    authorCommits[author] = (authorCommits[author] || 0) + 1;

    commitMessages[date].push({
      message: commit.commit.message,
      author: author,
      time: new Date(commit.commit.author.date),
      sha: commit.sha,
      url: commit.html_url,
    });
  });

  return { dailyCommits, authorCommits, commitMessages, authorDetails };
};

export const generateReport = (commits,startDate,endDate,owner,repoName) => {
    const stats = processCommites(commits,startDate,endDate);
    const doc = new jsPDF();

    // Title Page
    doc.setFontSize(24);
    doc.setTextColor(colors.primary);
    doc.text("GitHub Activity Report", 20, 30);

    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text(`Repository: ${owner}/${repoName}`, 20, 50);
    doc.text(
      `Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(
        endDate
      ).toLocaleDateString()}`,
      20,
      60
    );
    doc.text(`Total Commits: ${commits.length}`, 20, 70);
    doc.text(
      `Total Contributors: ${Object.keys(stats.authorDetails).length}`,
      20,
      80
    );

    // Contributor Summary
    doc.addPage();
    doc.setFontSize(18);
    doc.text("Contributor Activity Summary", 20, 20);

    // Split contributors into active and inactive
    const activeContributors = [];
    const inactiveContributors = [];

    Object.entries(stats.authorDetails).forEach(([author, details]) => {
      const commitCount = stats.authorCommits[author] || 0;
      const contributorInfo = [
        author,
        commitCount.toString(),
        `${((commitCount / commits.length) * 100).toFixed(1)}%`,
      ];

      if (commitCount > 0) {
        activeContributors.push(contributorInfo);
      } else {
        inactiveContributors.push(contributorInfo);
      }
    });

    // Sort active contributors by commit count
    activeContributors.sort((a, b) => parseInt(b[1]) - parseInt(a[1]));

    // Active Contributors Table
    doc.setFontSize(14);
    doc.text("Active Contributors", 20, 35);

    doc.autoTable({
      startY: 40,
      head: [["Contributor", "Commits", "Contribution %"]],
      body: activeContributors,
      theme: "grid",
      headStyles: { fillColor: colors.primary },
      styles: { fontSize: 10 },
    });

    // Inactive Contributors
    const currentY = doc.previousAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text(
      "Inactive Contributors (No commits in selected period)",
      20,
      currentY
    );

    if (inactiveContributors.length > 0) {
      doc.autoTable({
        startY: currentY + 5,
        head: [["Contributor", "Commits", "Contribution %"]],
        body: inactiveContributors,
        theme: "grid",
        headStyles: { fillColor: "#999999" },
        styles: { fontSize: 10 },
      });
    } else {
      doc.setFontSize(10);
      doc.text("No inactive contributors in this period", 20, currentY + 10);
    }

    // Daily Activity
    doc.addPage();
    doc.setFontSize(18);
    doc.text("Daily Commit Activity", 20, 20);

    // Filter out days with no commits
    const dailyActivity = Object.entries(stats.commitMessages)
      .filter(([date, messages]) => messages.length > 0)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .map(([date, messages]) => [
        new Date(date).toLocaleDateString(),
        messages.length.toString(),
        messages
          .map(
            (msg) =>
              `• ${msg.author}: ${msg.message.split("\n")[0].slice(0, 60)}${
                msg.message.length > 60 ? "..." : ""
              }`
          )
          .join("\n"),
      ]);

    doc.autoTable({
      startY: 25,
      head: [["Date", "Commits", "Details"]],
      body: dailyActivity,
      theme: "grid",
      headStyles: { fillColor: colors.primary },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: "auto" },
      },
    });

    // Summary Statistics
    doc.addPage();
    doc.setFontSize(18);
    doc.text("Summary Statistics", 20, 20);

    const summaryStats = [
      ["Total Commits", commits.length.toString()],
      ["Active Contributors", activeContributors.length.toString()],
      ["Inactive Contributors", inactiveContributors.length.toString()],
      [
        "Average Daily Commits",
        (
          commits.length /
          Math.ceil(
            (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
          )
        ).toFixed(1),
      ],
      [
        "Most Active Contributor",
        activeContributors.length > 0
          ? `${activeContributors[0][0]} (${activeContributors[0][1]} commits)`
          : "N/A",
      ],
    ];

    doc.autoTable({
      startY: 25,
      body: summaryStats,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    doc.save(`github-report-${owner}-${repoName}.pdf`);
};





