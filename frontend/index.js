let hasVoted = false;
const url = "https://marketvoter-backend.vercel.app";
async function bullishVotes() {
  try {
    const response = await fetch(`${url}/bullish`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const jsonData = await response.json();
    return jsonData.bullish;
  } catch (error) {
    document.getElementById("voteCount").innerHTML =
      "Server is currently down! please try again later";
    throw error;
  }
}

async function bearishVotes() {
  try {
    const response = await fetch(`${url}/bearish`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const jsonData = await response.json();
    return jsonData.bearish;
  } catch (error) {
    document.getElementById("voteCount").innerHTML =
      "Server is currently down! please try again later";
    throw error;
  }
}

// Initialize the chart once
var voteChartCanvas = document.getElementById("voteChart").getContext("2d");
var myChart = new Chart(voteChartCanvas, {
  type: "pie",
  data: {
    labels: ["Bullish", "Bearish"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});

async function vote(direction) {
  if (!hasVoted) {
    let [bullishData, bearishData] = await Promise.all([
      bullishVotes(),
      bearishVotes(),
    ]);

    try {
      // Ensure both values are numeric
      if (isNaN(bullishData) || isNaN(bearishData)) {
        throw new Error("Invalid numeric values");
      }
      let updateData;

      if (direction === "bullish") {
        updateData = { bullish: bullishData + 1 };
      } else if (direction === "bearish") {
        updateData = { bearish: bearishData + 1 };
      }

      fetch(`${url}/${direction}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: {
          "Content-type": "application/json",
        },
      });

      // Increment local variables
      if (direction === "bullish") {
        bullishData++;
      } else if (direction === "bearish") {
        bearishData++;
      }

      // Recalculate percentages after updating votes

      let totalVotes = bullishData + bearishData;

      if (totalVotes === 0) {
        throw new Error("Total votes is zero (division by zero error)");
      }

      let bullishPercentage = ((bullishData / totalVotes) * 100).toFixed(2);
      let bearishPercentage = ((bearishData / totalVotes) * 100).toFixed(2);

      document.getElementById("voteCount").innerHTML =
        "Bullish: " +
        bullishPercentage +
        "%, Bearish: " +
        bearishPercentage +
        "%";
    } catch (error) {
      // Handle the error as needed (e.g., set percentages to 0)
      document.getElementById("voteCount").innerHTML = "Error fetching data";
    }

    // Update the chart data and redraw
    myChart.data.datasets[0].data = [bullishData, bearishData];
    myChart.update();

    hasVoted = true;
  }
}
