// Define black swan events
const blackSwanEvents = {
  none: { name: "None", populationImpact: 1, lifeExpectancyImpact: 0, economicImpact: 1 },
  pandemic: { name: "Global Pandemic", populationImpact: 0.98, lifeExpectancyImpact: -2, economicImpact: 0.9 },
  worldWar: { name: "World War", populationImpact: 0.95, lifeExpectancyImpact: -5, economicImpact: 0.7 },
  economicCollapse: { name: "Global Economic Collapse", populationImpact: 0.99, lifeExpectancyImpact: -3, economicImpact: 0.6 },
  ai_singularity: { name: "AI Singularity", populationImpact: 1, lifeExpectancyImpact: 10, economicImpact: 1.5 },
  climate_disaster: { name: "Climate Disaster", populationImpact: 0.97, lifeExpectancyImpact: -4, economicImpact: 0.8 }
};

// Get DOM elements
const runSimulationButton = document.getElementById('runSimulation');
const resultsDiv = document.getElementById('results');
const qualitativeInsightsTextarea = document.getElementById('qualitativeInsights');

// Add event listeners for range inputs
document.getElementById('longevityBreakthroughProbability').addEventListener('input', updateRangeValue);
document.getElementById('longevityBreakthroughImpact').addEventListener('input', updateRangeValue);
document.getElementById('economicGrowthRate').addEventListener('input', updateRangeValue);

function updateRangeValue(e) {
  document.getElementById(`${e.target.id}Value`).textContent = 
    e.target.id === 'longevityBreakthroughImpact' ? `${e.target.value} years` : `${e.target.value}%`;
}

runSimulationButton.addEventListener('click', runSimulation);

function runSimulation() {
  // Get input values
  const population = Number(document.getElementById('population').value);
  const lifeExpectancy = Number(document.getElementById('lifeExpectancy').value);
  const retirementAge = Number(document.getElementById('retirementAge').value);
  const longevityBreakthroughProbability = Number(document.getElementById('longevityBreakthroughProbability').value);
  const longevityBreakthroughImpact = Number(document.getElementById('longevityBreakthroughImpact').value);
  const healthcareExpenditurePerCapita = Number(document.getElementById('healthcareExpenditurePerCapita').value);
  const years = Number(document.getElementById('years').value);
  const economicGrowthRate = Number(document.getElementById('economicGrowthRate').value);
  const societalAdaptationRate = document.getElementById('societalAdaptationRate').value;
  const workforceAdaptationRate = document.getElementById('workforceAdaptationRate').value;
  const infrastructureReadiness = document.getElementById('infrastructureReadiness').value;
  const legalFrameworkAdaptation = document.getElementById('legalFrameworkAdaptation').value;
  const blackSwanEventType = document.getElementById('blackSwanEventType').value;
  const blackSwanEventYear = Number(document.getElementById('blackSwanEventYear').value);

  const simulatedData = [];
  let currentPopulation = population;
  let currentLifeExpectancy = lifeExpectancy;
  let currentRetirementAge = retirementAge;
  let currentHealthcareExpenditure = healthcareExpenditurePerCapita * population;
  let currentWorkforce = population * 0.6; // Assuming initial 60% workforce
  let breakthroughYear = -1;
  let insights = [];
  let currentEconomicGrowthRate = economicGrowthRate;
  let centenarians = 0;
  let supercentenarians = 0;
  let cancerIncidenceInCentenarians = 0;

  const adaptationFactors = {
    low: 0.5,
    medium: 1,
    high: 1.5
  };

  for (let year = 0; year <= years; year++) {
    const hasBreakthrough = breakthroughYear === -1 && Math.random() * 100 < longevityBreakthroughProbability;
    
    if (hasBreakthrough) {
      breakthroughYear = year;
      currentLifeExpectancy += longevityBreakthroughImpact;
      insights.push(`Year ${year}: Major longevity breakthrough occurred, increasing life expectancy by ${longevityBreakthroughImpact} years.`);
    }

    // Black Swan Event
    if (year === blackSwanEventYear && blackSwanEventType !== 'none') {
      const event = blackSwanEvents[blackSwanEventType];
      currentPopulation *= event.populationImpact;
      currentLifeExpectancy += event.lifeExpectancyImpact;
      currentEconomicGrowthRate *= event.economicImpact;
      insights.push(`Year ${year}: ${event.name} occurred. Population impact: ${((1 - event.populationImpact) * 100).toFixed(2)}% decrease. Life expectancy impact: ${event.lifeExpectancyImpact} years. Economic impact: ${((1 - event.economicImpact) * 100).toFixed(2)}% decrease in growth rate.`);
    }

    const societalAdaptationFactor = adaptationFactors[societalAdaptationRate];
    const workforceAdaptationFactor = adaptationFactors[workforceAdaptationRate];
    const infrastructureReadinessFactor = adaptationFactors[infrastructureReadiness];
    const legalFrameworkAdaptationFactor = adaptationFactors[legalFrameworkAdaptation];

    // Adjust retirement age based on life expectancy and adaptation factors
    const retirementAgeIncrease = (currentLifeExpectancy - lifeExpectancy) * 0.5 * societalAdaptationFactor * legalFrameworkAdaptationFactor;
    currentRetirementAge = Math.min(retirementAge + retirementAgeIncrease, currentLifeExpectancy - 10);

    // Calculate workforce participation rate
    const workforceParticipationRate = 0.6 + (currentRetirementAge - retirementAge) * 0.01 * workforceAdaptationFactor * infrastructureReadinessFactor;

    const populationGrowthRate = 0.01 * societalAdaptationFactor * (currentLifeExpectancy / lifeExpectancy);
    currentPopulation *= (1 + populationGrowthRate);

    currentWorkforce = currentPopulation * workforceParticipationRate;

    const economicImpact = 1 + (currentEconomicGrowthRate / 100) * (currentLifeExpectancy / lifeExpectancy) * (currentWorkforce / (population * 0.6));
    currentHealthcareExpenditure *= economicImpact;

    // Calculate centenarians and supercentenarians
    centenarians = currentPopulation * 0.007; // 7 in 1,000 as per the study
    supercentenarians = currentPopulation * 0.00001; // 1 in 100,000 as per the study

    // Calculate cancer incidence in centenarians
    cancerIncidenceInCentenarians = centenarians * 0.163; // 16.3% as per the autopsy study

    simulatedData.push({
      year,
      population: Math.round(currentPopulation),
      lifeExpectancy: Math.round(currentLifeExpectancy),
      retirementAge: Math.round(currentRetirementAge),
      healthcareExpenditure: Math.round(currentHealthcareExpenditure),
      workforce: Math.round(currentWorkforce),
      economicGrowthRate: currentEconomicGrowthRate,
      centenarians: Math.round(centenarians),
      supercentenarians: Math.round(supercentenarians),
      cancerIncidenceInCentenarians: Math.round(cancerIncidenceInCentenarians),
    });

    if (year % 10 === 0 || hasBreakthrough || year === blackSwanEventYear) {
      insights.push(`Year ${year}:
      Population: ${Math.round(currentPopulation).toLocaleString()}
      Life Expectancy: ${Math.round(currentLifeExpectancy)}
      Retirement Age: ${Math.round(currentRetirementAge)}
      Workforce: ${Math.round(currentWorkforce).toLocaleString()}
      Healthcare Expenditure: $${Math.round(currentHealthcareExpenditure).toLocaleString()}
      Economic Growth Rate: ${currentEconomicGrowthRate.toFixed(2)}%
      Centenarians: ${Math.round(centenarians).toLocaleString()}
      Supercentenarians: ${Math.round(supercentenarians).toLocaleString()}
      Cancer Incidence in Centenarians: ${Math.round(cancerIncidenceInCentenarians).toLocaleString()}`);
    }
  }

  displayResults(simulatedData, insights);
}

function displayResults(data, insights) {
  resultsDiv.style.display = 'block';
  qualitativeInsightsTextarea.value = insights.join('\n\n');

  // Here you would use a charting library like Chart.js or D3.js to create the chart
  // For example, using Chart.js:
  // const ctx = document.getElementById('chart').getContext('2d');
  // new Chart(ctx, {
  //   type: 'line',
  //   data: {
  //     labels: data.map(d => d.year),
  //     datasets: [
  //       {
  //         label: 'Population',
  //         data: data.map(d => d.population),
  //         borderColor: 'rgb(75, 192, 192)',
  //         tension: 0.1
  //       },
  //       // Add more datasets for other metrics
  //     ]
  //   },
  //   options: {
  //     responsive: true,
  //     scales: {
  //       y: {
  //         beginAtZero: true
  //       }
  //     }
  //   }
  // });
}