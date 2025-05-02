import React from "react";
import {
  processCommites,
  generateReport,
} from "../../../../../services/operations/githubAPI";
import ContributorsOverview from "./ContributorsOverview";
import RecentCommits from "./RecentCommits";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

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


const RenderCharts = ({ commits, startDate, endDate, owner, repoName }) => {
  const stats = processCommites(commits, startDate, endDate);
  const dates = Object.keys(stats.dailyCommits).sort();

  const lineChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: dates.map(date => new Date(date).toLocaleDateString()),
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'dd MMM yyyy'
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      }
    }
  };

  const lineChartSeries = [{
    name: 'Daily Commits',
    data: dates.map(date => stats.dailyCommits[date])
  }];

  const sortedContributors = Object.keys(stats.authorDetails)
    .sort((a, b) => (stats.authorCommits[b] || 0) - (stats.authorCommits[a] || 0));

  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
        distributed: true,
      }
    },
    colors: [
      '#2563eb', '#059669', '#d97706', '#0891b2', 
      '#6366f1', '#8b5cf6', '#ec4899', '#ef4444'
    ],
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: sortedContributors,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        title: {
          formatter: () => 'Commits'
        }
      }
    }
  };

  const barChartSeries = [{
    name: 'Commits',
    data: sortedContributors.map(author => stats.authorCommits[author] || 0)
  }];

  return (
    <div className="space-y-8">
      <ContributorsOverview stats={stats} commits={commits} />

      <div className="flex flex-col gap-y-2">
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Contributor Impact
            </h3>
            <p className="text-sm text-gray-500">
              Commit distribution by contributor
            </p>
          </div>
          <div className="h-[300px]">
            <ReactApexChart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height="100%"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Commit Activity
              </h3>
              <p className="text-sm text-gray-500">
                Daily commit frequency over time
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {commits.length}
                </p>
                <p className="text-sm text-gray-500">Total Commits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Object.keys(stats.authorDetails).length}
                </p>
                <p className="text-sm text-gray-500">Contributors</p>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ReactApexChart
              options={lineChartOptions}
              series={lineChartSeries}
              type="area"
              height="100%"
            />
          </div>
        </div>
      </div>

      <RecentCommits
        commits={commits}
        startDate={startDate}
        endDate={endDate}
        generateReport={() =>
          generateReport(commits, startDate, endDate, owner, repoName)
        }
      />
    </div>
  );
}

export default RenderCharts;
