let hasVoted = false;

async function bullishVotes() {
  try {
    const response = await fetch("http://localhost:3000/bullish");
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const jsonData = await response.json();
    return jsonData.bullish;
  } catch (error) {
    alert("server is currently down! Please try again later");
    console.error("Error fetching bullish votes:", error.message);
    throw error;
  }
}

async function bearishVotes() {
  try {
    const response = await fetch("http://localhost:3000/bearish");
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const jsonData = await response.json();
    return jsonData.bearish;
  } catch (error) {
    alert("server is currently down! Please try again later");
    console.error("Error fetching bearish votes:", error.message);
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
  let bullishData = await bullishVotes();
  let bearishData = await bearishVotes();

  if (!hasVoted) {
    let updateData;

    if (direction === "bullish") {
      updateData = { bullish: bullishData + 1 };
    } else if (direction === "bearish") {
      updateData = { bearish: bearishData + 1 };
    }

    const response = await fetch(`http://localhost:3000/${direction}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Increment local variables
    if (direction === "bullish") {
      bullishData++;
    } else if (direction === "bearish") {
      bearishData++;
    }

    // Recalculate percentages after updating votes
    updatePercentages();

    // Update the chart data and redraw
    myChart.data.datasets[0].data = [bullishData, bearishData];
    myChart.update();

    hasVoted = true;
  }
}

async function updatePercentages() {
  try {
    let bullishData = await bullishVotes();
    let bearishData = await bearishVotes();

    // Ensure both values are numeric
    if (isNaN(bullishData) || isNaN(bearishData)) {
      throw new Error("Invalid numeric values");
    }

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
    console.error("Error updating percentages:", error.message);
    // Handle the error as needed (e.g., set percentages to 0)
    document.getElementById("voteCount").innerHTML =
      "Error updating percentages";
  }
}
