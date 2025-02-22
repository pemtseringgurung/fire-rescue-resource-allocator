// Calculate distance between two points using Haversine formula
const calculateDistance = (point1, point2) => {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Get stations sorted by distance to fire
const getStationsByDistance = (firePosition, stations) => {
  return stations
    .map(station => ({
      ...station,
      distance: calculateDistance(firePosition, station.position)
    }))
    .sort((a, b) => a.distance - b.distance);
};

// Calculate required resources based on fire intensity
const calculateRequiredResources = (fireIntensity) => {
  const baseFirefighters = 10;
  const baseWater = 10;
  const baseFiretrucks = 2;

  return {
    firefighters: Math.round(baseFirefighters * fireIntensity),
    water: Math.round(baseWater * fireIntensity),
    firetrucks: Math.round(baseFiretrucks * fireIntensity)
  };
};

// Main optimization function
export const optimizeResources = (fireStations, fires) => {
  return optimizeResourcesGenetic(fireStations, fires, {
    populationSize: 100,
    generations: 500,
    mutationRate: 0.9,
    elitismCount: 20
  });
};

// Calculate response time based on distance
const calculateResponseTime = (distance) => {
  return 0.65 + 1.7 * distance; // time in minutes
};

// Calculate how well resources match the fire's needs
const calculateResourceMatch = (allocated, required) => {
  // Penalize both under and over-allocation
  const firefighterScore = 1 - Math.abs(allocated.firefighters - required.firefighters) / required.firefighters;
  const waterScore = 1 - Math.abs(allocated.water - required.water) / required.water;
  const truckScore = 1 - Math.abs(allocated.firetrucks - required.firetrucks) / required.firetrucks;
  
  // Average of all resource scores
  return (firefighterScore + waterScore + truckScore) / 3;
};

// Calculate fitness score for the entire allocation
export const calculateAllocationFitness = (allocation, fireStations, fires) => {
  let totalFitness = 0;
  
  fires.forEach(fire => {
    const requiredResources = calculateRequiredResources(fire.intensity || 1);
    
    // Sum up total allocated resources for this fire from all stations
    const totalAllocated = {
      firefighters: 0,
      water: 0,
      firetrucks: 0
    };
    
    let weightedResponseTime = 0;
    let totalResources = 0;

    // Calculate total resources and weighted response time
    Object.entries(allocation).forEach(([stationId, stationAllocations]) => {
      if (stationAllocations[fire.id]) {
        const station = fireStations.stations.find(s => s.id === parseInt(stationId));
        const distance = calculateDistance(fire.position, station.position);
        const responseTime = calculateResponseTime(distance);
        
        // Much stronger distance penalty
        const distancePenalty = Math.exp(distance / 2); // Changed from 5 to 2
        
        const resourceCount = 
          stationAllocations[fire.id].firefighters + 
          stationAllocations[fire.id].water + 
          stationAllocations[fire.id].firetrucks;
        
        totalAllocated.firefighters += stationAllocations[fire.id].firefighters;
        totalAllocated.water += stationAllocations[fire.id].water;
        totalAllocated.firetrucks += stationAllocations[fire.id].firetrucks;
        
        weightedResponseTime += (responseTime * resourceCount * distancePenalty);
        totalResources += resourceCount;
      }
    });

    // Average response time weighted by resources
    const avgResponseTime = totalResources > 0 ? weightedResponseTime / totalResources : Infinity;
    
    // Calculate scores
    const resourceMatchScore = calculateResourceMatch(totalAllocated, requiredResources);
    const timeScore = Math.max(0, 1 - (avgResponseTime / 10)); // Reduced from 15 to 10 minutes
    
    // Even more emphasis on time (changed from 0.4/0.6 to 0.3/0.7)
    const fireFitness = (resourceMatchScore * 0.3) + (timeScore * 0.7);
    
    // Add to total fitness, weighted by fire intensity
    totalFitness += fireFitness * (fire.intensity || 1);
  });
  
  // Normalize by total fire intensity
  const totalIntensity = fires.reduce((sum, fire) => sum + (fire.intensity || 1), 0);
  return totalFitness / (totalIntensity || 1);
};

// Create a random allocation that respects station capacity
const createRandomAllocation = (fireStations, fires) => {
  let allocation = {};
  let remainingResources = {};
  
  // Initialize remaining resources
  fireStations.stations.forEach(station => {
    remainingResources[station.id] = { ...station.resources };
  });

  fires.forEach(fire => {
    const requiredResources = calculateRequiredResources(fire.intensity || 1);
    
    // Sort stations by distance for this fire
    const sortedStations = getStationsByDistance(fire.position, fireStations.stations);
    
    sortedStations.forEach(station => {
      if (!allocation[station.id]) {
        allocation[station.id] = {};
      }

      // Higher chance of allocation for closer stations
      const distance = calculateDistance(fire.position, station.position);
      const allocationChance = Math.exp(-distance / 5); // Exponentially decreasing probability
      
      if (Math.random() < allocationChance) {
        // Randomly allocate resources within available limits
        const stationAllocation = {
          firefighters: Math.min(
            Math.floor(Math.random() * (requiredResources.firefighters + 1)),
            remainingResources[station.id].firefighters
          ),
          water: Math.min(
            Math.floor(Math.random() * (requiredResources.water + 1)),
            remainingResources[station.id].water
          ),
          firetrucks: Math.min(
            Math.floor(Math.random() * (requiredResources.firetrucks + 1)),
            remainingResources[station.id].firetrucks
          )
        };

        // Only add allocation if any resources are being sent
        if (stationAllocation.firefighters > 0 || 
            stationAllocation.water > 0 || 
            stationAllocation.firetrucks > 0) {
          // Update remaining resources
          remainingResources[station.id].firefighters -= stationAllocation.firefighters;
          remainingResources[station.id].water -= stationAllocation.water;
          remainingResources[station.id].firetrucks -= stationAllocation.firetrucks;

          allocation[station.id][fire.id] = stationAllocation;
        }
      }
    });
  });

  return allocation;
};

// Crossover two parent allocations to create a child
const crossover = (parent1, parent2, fireStations, fires) => {
  let child = {};
  let remainingResources = {};
  
  // Initialize remaining resources
  fireStations.stations.forEach(station => {
    remainingResources[station.id] = { ...station.resources };
  });

  // For each station-fire pair, randomly choose from either parent
  fireStations.stations.forEach(station => {
    child[station.id] = {};
    
    fires.forEach(fire => {
      const useParent1 = Math.random() < 0.5;
      const parentAllocation = useParent1 ? parent1[station.id]?.[fire.id] : parent2[station.id]?.[fire.id];
      
      if (parentAllocation) {
        // Ensure we don't exceed remaining resources
        const allocation = {
          firefighters: Math.min(parentAllocation.firefighters, remainingResources[station.id].firefighters),
          water: Math.min(parentAllocation.water, remainingResources[station.id].water),
          firetrucks: Math.min(parentAllocation.firetrucks, remainingResources[station.id].firetrucks)
        };

        // Update remaining resources
        remainingResources[station.id].firefighters -= allocation.firefighters;
        remainingResources[station.id].water -= allocation.water;
        remainingResources[station.id].firetrucks -= allocation.firetrucks;

        child[station.id][fire.id] = allocation;
      }
    });
  });

  return child;
};

// Mutate an allocation
const mutate = (allocation, fireStations, fires, mutationRate = 0.1) => {
  const mutated = JSON.parse(JSON.stringify(allocation));
  let remainingResources = {};
  
  // Calculate remaining resources after current allocation
  fireStations.stations.forEach(station => {
    remainingResources[station.id] = { ...station.resources };
    Object.values(mutated[station.id] || {}).forEach(resources => {
      remainingResources[station.id].firefighters -= resources.firefighters;
      remainingResources[station.id].water -= resources.water;
      remainingResources[station.id].firetrucks -= resources.firetrucks;
    });
  });

  // Randomly mutate some allocations
  fireStations.stations.forEach(station => {
    fires.forEach(fire => {
      if (Math.random() < mutationRate) {
        const currentAllocation = mutated[station.id]?.[fire.id];
        if (currentAllocation) {
          // Modify existing allocation
          const maxAdjustment = 2; // Maximum resource adjustment
          
          const adjustFirefighters = Math.floor(Math.random() * maxAdjustment * 2 - maxAdjustment);
          const adjustWater = Math.floor(Math.random() * maxAdjustment * 2 - maxAdjustment);
          const adjustFiretrucks = Math.floor(Math.random() * maxAdjustment * 2 - maxAdjustment);

          mutated[station.id][fire.id] = {
            firefighters: Math.max(0, Math.min(
              currentAllocation.firefighters + adjustFirefighters,
              remainingResources[station.id].firefighters + currentAllocation.firefighters
            )),
            water: Math.max(0, Math.min(
              currentAllocation.water + adjustWater,
              remainingResources[station.id].water + currentAllocation.water
            )),
            firetrucks: Math.max(0, Math.min(
              currentAllocation.firetrucks + adjustFiretrucks,
              remainingResources[station.id].firetrucks + currentAllocation.firetrucks
            ))
          };
        }
      }
    });
  });

  return mutated;
};

// Main genetic algorithm optimization function
const optimizeResourcesGenetic = (fireStations, fires, options = {}) => {
  const {
    populationSize = 50,
    generations = 100,
    mutationRate = 0.1,
    elitismCount = 5
  } = options;

  // Initialize population
  let population = Array(populationSize).fill(null).map(() => 
    createRandomAllocation(fireStations, fires)
  );

  // Evolution loop
  for (let gen = 0; gen < generations; gen++) {
    // Evaluate fitness for all individuals
    const fitnessScores = population.map(allocation => 
      calculateAllocationFitness(allocation, fireStations, fires)
    );

    // Sort population by fitness
    const sortedPopulation = population
      .map((allocation, index) => ({ allocation, fitness: fitnessScores[index] }))
      .sort((a, b) => b.fitness - a.fitness);

    // Select elite individuals
    const newPopulation = sortedPopulation
      .slice(0, elitismCount)
      .map(({ allocation }) => JSON.parse(JSON.stringify(allocation)));

    // Create rest of new population
    while (newPopulation.length < populationSize) {
      // Tournament selection
      const parent1 = sortedPopulation[Math.floor(Math.random() * (populationSize / 2))].allocation;
      const parent2 = sortedPopulation[Math.floor(Math.random() * (populationSize / 2))].allocation;
      
      // Crossover and mutation
      let child = crossover(parent1, parent2, fireStations, fires);
      child = mutate(child, fireStations, fires, mutationRate);
      
      newPopulation.push(child);
    }

    population = newPopulation;
  }

  // Return best allocation
  const finalFitnessScores = population.map(allocation => 
    calculateAllocationFitness(allocation, fireStations, fires)
  );
  const bestIndex = finalFitnessScores.indexOf(Math.max(...finalFitnessScores));
  
  return population[bestIndex];
};

// Example usage:
/*
const allocation = optimizeResources(
  {
    stations: [
      { id: 1, position: [34.0522, -118.2437], name: "Station 1" },
      { id: 2, position: [34.0622, -118.2537], name: "Station 2" }
    ]
  },
  [
    { id: 1, position: [34.0522, -118.2437], size: 35 },
    { id: 2, position: [34.0622, -118.2537], size: 35 }
  ]
);
*/ 