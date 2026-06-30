function knapsack(capacity, vehicles) {
  const n = vehicles.length;

  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const duration = vehicles[i - 1].Duration;
    const impact = vehicles[i - 1].Impact;

    for (let j = 0; j <= capacity; j++) {
      if (duration <= j) {
        dp[i][j] = Math.max(impact + dp[i - 1][j - duration], dp[i - 1][j]);
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  let selectedTasks = [];
  let totalDuration = 0;

  let j = capacity;

  for (let i = n; i > 0; i--) {
    if (dp[i][j] !== dp[i - 1][j]) {
      selectedTasks.push(vehicles[i - 1].TaskID);
      totalDuration += vehicles[i - 1].Duration;
      j -= vehicles[i - 1].Duration;
    }
  }

  return {
    totalImpact: dp[n][capacity],
    totalDuration,
    selectedTasks: selectedTasks.reverse(),
  };
}

module.exports = knapsack;
